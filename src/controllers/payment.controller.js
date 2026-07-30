const mongoose =
require("mongoose");

const razorpay =
require("../config/razorpay");
const crypto =
require("crypto");

const User =
require("../models/User");

const RegistrationDraft =
require("../models/RegistrationDraft");

const UserSubscription =
require("../models/UserSubscription");

const RefreshToken =
require("../models/RefreshToken");
const Payment =
require("../models/Payment");

const PaymentHistory =
require("../models/PaymentHistory");

const Invoice =
require("../models/Invoice");

const SubscriptionPlan =
require("../models/SubscriptionPlan");

const generateAccessToken =
require("../utils/generateAccessToken");

const generateRefreshToken =
require("../utils/generateRefreshToken");

const invoiceService =
require("../services/invoice.service");

const notificationService =
require("../services/notification.service");

const paymentWorkflow =
require("../services/paymentWorkflow.service");

const { auditLog } =
require("../utils/auditLogger");

const logger =
require("../utils/logger");

exports.createOrder =
async (req,res)=>{

 try{

   const {
      draftId,
      subscriptionPlanId
   } = req.body;

   const plan =
   await SubscriptionPlan
   .findById(
      subscriptionPlanId
   );

   if(!plan){

      return res.status(404)
      .json({
         success:false,
         message:"Plan not found"
      });

   }

   const options = {

      amount:
      plan.amount * 100,

      currency:"INR",

      receipt:
      `receipt_${Date.now()}`
   };

   const order =
   await razorpay.orders.create(
      options
   );

   const payment =
   await Payment.create({

      draftId,

      subscriptionPlanId,

      orderId:
      order.id,

      amount:
      plan.amount,

      status:"created"

   });

   // Payment history: initial "order created" event.
   // Not part of a transaction here - a single insert
   // has nothing to roll back alongside it.
   await PaymentHistory.create({

      paymentId:payment._id,

      orderId:order.id,

      amount:plan.amount,

      status:"created",

      event:"order_created"

   }).catch((error)=>{

      logger.error({
         message:
         "Failed to record payment history " +
         "for order creation",
         error:error.message,
         orderId:order.id
      });

   });

   res.status(200).json({

      success:true,

      order

   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// Returns the same response shape as a fresh verification,
// built from records that already exist. Used when
// verifyPayment is called again for an order that has
// already been processed successfully (network retry,
// double submit, etc.) so we never re-run the workflow or
// create a duplicate user/subscription/invoice.
const buildAlreadyProcessedResponse =
async(payment)=>{

 const user =
 await User.findById(payment.userId);

 if(!user){
   return null;
 }

 const invoice =
 await Invoice.findOne({
   paymentId:payment._id
 });

 const accessToken =
 generateAccessToken(user._id);

 const refreshToken =
 generateRefreshToken(user._id);

 await RefreshToken.create({
   user:user._id,
   token:refreshToken
 });

 return {

   success:true,

   accessToken,

   refreshToken,

   user,

   invoiceNumber:
   invoice ? invoice.invoiceNumber : null,

   alreadyProcessed:true

 };

};

exports.verifyPayment =
async (req,res)=>{

 const {

  draftId,

  razorpay_order_id,

  razorpay_payment_id,

  razorpay_signature

 } = req.body;

 // 1. Signature verification - pure computation, no DB
 // access, so it happens before any session/transaction
 // is opened.
 const generatedSignature =
 crypto
 .createHmac(
    "sha256",
    process.env
    .RAZORPAY_KEY_SECRET
 )
 .update(
    razorpay_order_id +
    "|" +
    razorpay_payment_id
 )
 .digest("hex");

 if(
    generatedSignature !==
    razorpay_signature
 ){

    return res.status(400)
    .json({
      success:false,
      message:
      "Invalid Signature"
    });

 }

 // 2. Idempotency guard: if this order has already been
 // marked "success", replay the original result instead
 // of re-running the workflow (avoids duplicate
 // user/subscription/invoice on retried requests).
 const existingPayment =
 await Payment.findOne({
   orderId:razorpay_order_id
 });

 if(!existingPayment){

    return res.status(404)
    .json({
      success:false,
      message:"Order not found"
    });

 }

 if(existingPayment.status === "success"){

    const alreadyProcessed =
    await buildAlreadyProcessedResponse(
      existingPayment
    );

    if(alreadyProcessed){
      return res.status(200)
      .json(alreadyProcessed);
    }

    // Payment says success but the user record is
    // missing - fall through and let the normal error
    // handling below report it, rather than silently
    // reprocessing.

 }

 // 3. Everything from here on mutates multiple
 // collections that must all succeed or all roll back
 // together, so it runs inside a single Mongo
 // transaction.
 const session =
 await mongoose.startSession();

 let user, updatedPayment, invoice, subscription,
 trainer, dietAssignment, accessToken, refreshToken;

 try{

    session.startTransaction();

    const draft =
    await RegistrationDraft
    .findById(draftId)
    .session(session);

    if(!draft){
      throw new Error(
        "Registration draft not found"
      );
    }

    const plan =
    await SubscriptionPlan
    .findById(
       draft.subscriptionPlanId
    )
    .session(session);

    if(!plan){
      throw new Error(
        "Subscription plan not found"
      );
    }

    const createdUsers =
    await User.create(
      [{

        fullName:
        draft.fullName,

        email:
        draft.email,

        mobile:
        draft.mobile,

        password:
        draft.password,

        branchId:
        draft.branchId,

        subscriptionPlanId:
        draft.subscriptionPlanId

      }],
      { session }
    );

    user = createdUsers[0];

    const startDate =
    new Date();

    const endDate =
    new Date();

    endDate.setDate(
      endDate.getDate() +
      plan.durationDays
    );

    // --- Assign Trainer (best-effort, non-fatal) ---
    trainer =
    await paymentWorkflow
    .assignTrainer(
      draft.branchId,
      session
    );

    // --- Update Membership ---
    const createdSubscriptions =
    await UserSubscription.create(
      [{

        userId:user._id,

        subscriptionPlanId:
        plan._id,

        trainerId:
        trainer ? trainer._id : undefined,

        startDate,

        endDate,

        amount:
        plan.amount,

        status:"active"

      }],
      { session }
    );

    subscription = createdSubscriptions[0];

    // --- Assign Diet (best-effort, non-fatal) ---
    dietAssignment =
    await paymentWorkflow
    .assignDiet({
      userId:user._id,
      startDate,
      endDate,
      session
    });

    if(dietAssignment){

      subscription.dietId =
      dietAssignment._id;

      await subscription.save({ session });

    }

    // --- Update Payment (mark success) ---
    updatedPayment =
    await Payment.findOneAndUpdate(

       {
          orderId:
          razorpay_order_id
       },

       {
          userId:
          user._id,

          paymentId:
          razorpay_payment_id,

          status:"success"
       },

       {
          new:true,
          session
       }

    );

    if(!updatedPayment){
      throw new Error(
        "Payment record not found"
      );
    }

    // --- Generate Invoice (DB record only; PDF/email
    // are external I/O and happen after commit) ---
    invoice =
    await invoiceService
    .generateInvoiceForPayment(
       updatedPayment,
       user,
       { session, skipPdf:true }
    );

    // --- Create Notification entry (in-app) ---
    await notificationService
    .createInAppNotification({

      title:"Payment Successful",

      message:
      `Your payment of Rs. ${plan.amount} for ` +
      `${plan.name} was successful. Your ` +
      `membership is now active.`,

      userId:user._id,

      targetType:"user",

      session

    });

    // --- Create Activity Log ---
    await auditLog({

      userId:user._id,

      action:"PAYMENT_SUCCESS",

      module:"payment",

      payload:{

        orderId:razorpay_order_id,

        paymentId:razorpay_payment_id,

        subscriptionPlanId:plan._id,

        amount:plan.amount,

        trainerId:
        trainer ? trainer._id : null,

        dietId:
        dietAssignment ?
        dietAssignment._id : null,

        invoiceId:invoice._id

      },

      session

    });

    // --- Create Payment History ---
    await PaymentHistory.create(
      [{

        paymentId:updatedPayment._id,

        userId:user._id,

        orderId:razorpay_order_id,

        transactionId:razorpay_payment_id,

        amount:updatedPayment.amount,

        status:"success",

        event:"payment_success",

        meta:{
          invoiceNumber:
          invoice.invoiceNumber
        }

      }],
      { session }
    );

    accessToken =
    generateAccessToken(
       user._id
    );

    refreshToken =
    generateRefreshToken(
       user._id
    );

    await RefreshToken.create(

      [{
        user:user._id,
        token:refreshToken
      }],

      { session }

    );

    await RegistrationDraft
    .findByIdAndDelete(
       draftId,
       { session }
    );

    await session.commitTransaction();

 }catch(error){

    await session.abortTransaction()
    .catch(()=>{});

    logger.error({
      message:
      "Payment verification workflow failed, " +
      "transaction rolled back",
      error:error.message,
      orderId:razorpay_order_id
    });

    // Best-effort bookkeeping for the failure, done
    // OUTSIDE the aborted transaction. Not wrapped in
    // its own try/catch beyond this one, since it's
    // only diagnostic - if it fails too we've already
    // logged the root cause above.
    try{

      await Payment.findOneAndUpdate(
        { orderId:razorpay_order_id },
        { status:"failed" }
      );

      await PaymentHistory.create({

        paymentId:existingPayment._id,

        orderId:razorpay_order_id,

        transactionId:razorpay_payment_id,

        amount:existingPayment.amount,

        status:"failed",

        event:"payment_failed",

        meta:{ error:error.message }

      });

    }catch(bookkeepingError){

      logger.error({
        message:
        "Failed to record payment failure",
        error:bookkeepingError.message,
        orderId:razorpay_order_id
      });

    }

    return res.status(500).json({

       success:false,

       message:error.message

    });

 }finally{

    session.endSession();

 }

 // 4. Post-commit, best-effort side effects. These are
 // external I/O (PDF render/upload, SMTP, push webhook)
 // and are intentionally outside the transaction: they
 // cannot be rolled back, and the payment/membership must
 // not be undone just because an email or push failed to
 // send.
 try{

    invoice =
    await invoiceService
    .attachInvoicePdf(invoice,user);

    await invoiceService
    .sendInvoiceEmail(invoice,user);

 }catch(sideEffectError){

    logger.error({
       message:
       "Invoice PDF/email step failed " +
       "after successful payment",
       error:sideEffectError.message,
       paymentId:updatedPayment._id
    });

 }

 try{

    await notificationService
    .sendPushNotification({

      userId:user._id,

      title:"Payment Successful",

      body:
      "Your membership is now active. " +
      "Welcome aboard!",

      data:{
        type:"payment_success",
        invoiceNumber:invoice.invoiceNumber
      }

    });

 }catch(pushError){

    logger.error({
       message:
       "Push notification failed after " +
       "successful payment",
       error:pushError.message,
       userId:user._id
    });

 }

 res.status(200).json({

    success:true,

    accessToken,

    refreshToken,

    user,

    trainerAssigned:
    trainer ?
    { trainerId:trainer._id, name:trainer.name } :
    null,

    dietAssigned:
    dietAssignment ?
    { userDietId:dietAssignment._id } :
    null,

    invoiceNumber:
    invoice ?
    invoice.invoiceNumber :
    null

 });

};