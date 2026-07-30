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

const SubscriptionPlan =
require("../models/SubscriptionPlan");

const generateAccessToken =
require("../utils/generateAccessToken");

const generateRefreshToken =
require("../utils/generateRefreshToken");

const invoiceService =
require("../services/invoice.service");

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

   await Payment.create({

      draftId,

      subscriptionPlanId,

      orderId:
      order.id,

      amount:
      plan.amount,

      status:"created"

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



exports.verifyPayment =
async (req,res)=>{

 try{

  const {

   draftId,

   razorpay_order_id,

   razorpay_payment_id,

   razorpay_signature

  } = req.body;

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

  const draft =
  await RegistrationDraft
  .findById(draftId);

  const user =
  await User.create({

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

  });

  const plan =
  await SubscriptionPlan
  .findById(
     draft.subscriptionPlanId
  );

  const startDate =
  new Date();

  const endDate =
  new Date();

  endDate.setDate(
    endDate.getDate() +
    plan.durationDays
  );

  await UserSubscription
  .create({

      userId:user._id,

      subscriptionPlanId:
      plan._id,

      startDate,

      endDate,

      amount:
      plan.amount,

      status:"active"

  });

  const updatedPayment =
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
        new:true
     }

  );

  // Invoice generation must never block a successful
  // payment/registration response. Failures are logged
  // and can be retried later (Invoice is keyed uniquely
  // on paymentId, so retrying is safe and never creates
  // a duplicate).
  let invoice = null;

  if(updatedPayment){

     try{

        invoice =
        await invoiceService
        .generateInvoiceForPayment(
           updatedPayment,
           user
        );

     }catch(invoiceError){

        logger.error({
           message:
           "Invoice generation failed",

           error:
           invoiceError.message,

           paymentId:
           updatedPayment._id
        });

     }

  }

  const accessToken =
  generateAccessToken(
     user._id
  );

  const refreshToken =
  generateRefreshToken(
     user._id
  );

  await RefreshToken.create({

      user:user._id,

      token:
      refreshToken

  });

  await RegistrationDraft
  .findByIdAndDelete(
     draftId
  );

  res.status(200).json({

      success:true,

      accessToken,

      refreshToken,

      user,

      invoiceNumber:
      invoice ?
      invoice.invoiceNumber :
      null

  });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};