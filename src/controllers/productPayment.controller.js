const mongoose =
require("mongoose");

const crypto =
require("crypto");

const razorpay =
require("../config/razorpay");

const Order =
require("../models/Order");

const Product =
require("../models/Product");

const Cart =
require("../models/Cart");

const Payment =
require("../models/Payment");

const processSuccessfulProductPayment =
async({
  order,
  razorpayPaymentId,
  razorpaySignature,
  session
}) => {

  const now = new Date();

  // The order may already be paid because the client retried
  // the verification request.
  if(order.paymentStatus === "paid"){
    return order;
  }

  const freshOrder =
  await Order.findOne({
    _id:order._id
  }).session(session);

  if(!freshOrder){
    throw new Error("Order not found");
  }

  if(freshOrder.paymentStatus === "paid"){
    return freshOrder;
  }

  if(!freshOrder.razorpayOrderId){
    throw new Error("Razorpay order is not linked to this order");
  }

  // Commit stock exactly once. Each update is conditional so
  // stock can never go below zero.
  if(!freshOrder.stockCommitted){

    for(const item of freshOrder.items){

      const updatedProduct =
      await Product.findOneAndUpdate(
        {
          _id:item.productId,
          stock:{
            $gte:item.quantity
          },
          status:true
        },
        {
          $inc:{
            stock:-item.quantity
          }
        },
        {
          new:true
        }
      ).session(session);

      if(!updatedProduct){

        throw new Error(
          `Insufficient stock for ${item.productName}`
        );

      }

    }

    freshOrder.stockCommitted = true;
  }

  freshOrder.paymentId =
    razorpayPaymentId;

  freshOrder.razorpayPaymentId =
    razorpayPaymentId;

  freshOrder.razorpaySignature =
    razorpaySignature;

  freshOrder.paymentStatus =
    "paid";

  freshOrder.orderStatus =
    "confirmed";

  freshOrder.paidAt =
    now;

  freshOrder.confirmedAt =
    now;

  await freshOrder.save({
    session
  });

  await Payment.findOneAndUpdate(
    {
      productOrderId:freshOrder._id
    },
    {
      userId:freshOrder.userId,
      orderId:freshOrder.razorpayOrderId,
      paymentId:razorpayPaymentId,
      razorpaySignature,
      amount:freshOrder.totalAmount,
      status:"success",
      orderType:"product"
    },
    {
      new:true,
      session
    }
  );

  if(!freshOrder.cartCleared){

    await Cart.updateOne(
      {
        userId:freshOrder.userId
      },
      {
        $pull:{
          items:{
            productId:{
              $in:freshOrder.items.map(
                item => item.productId
              )
            }
          }
        }
      }
    ).session(session);

    freshOrder.cartCleared = true;

    await freshOrder.save({
      session
    });

  }

  return freshOrder;
};

exports.createProductRazorpayOrder =
async(req,res)=>{

  try{

    const order =
    await Order.findOne({
      _id:req.params.orderId,
      userId:req.user._id
    });

    if(!order){

      return res.status(404).json({
        success:false,
        message:"Order not found"
      });

    }

    if(order.paymentStatus === "paid"){

      return res.status(400).json({
        success:false,
        message:"Order is already paid"
      });

    }

    if(order.orderStatus === "cancelled"){

      return res.status(400).json({
        success:false,
        message:"Cancelled order cannot be paid"
      });

    }

    if(!Number.isFinite(order.totalAmount) ||
       order.totalAmount <= 0){

      return res.status(400).json({
        success:false,
        message:"Invalid order amount"
      });

    }

    // Revalidate product status/stock before creating a
    // payment order. The amount itself remains the amount
    // captured in the local order snapshot.
    for(const item of order.items){

      const product =
      await Product.findById(
        item.productId
      );

      if(!product || !product.status){

        return res.status(400).json({
          success:false,
          message:
          `Product unavailable: ${item.productName}`
        });

      }

      if(product.stock < item.quantity){

        return res.status(400).json({
          success:false,
          message:
          `Insufficient stock for ${item.productName}`
        });

      }

    }

    let payment =
    await Payment.findOne({
      productOrderId:order._id,
      orderType:"product"
    });

    if(order.razorpayOrderId){

      return res.status(200).json({
        success:true,
        orderId:order.razorpayOrderId,
        amount:Math.round(
          order.totalAmount * 100
        ),
        currency:"INR",
        keyId:
        process.env.RAZORPAY_KEY_ID
      });

    }

    const razorpayOrder =
    await razorpay.orders.create({

      amount:
      Math.round(
        order.totalAmount * 100
      ),

      currency:"INR",

      receipt:
      `product_${order._id}`

    });

    if(!payment){

      payment =
      await Payment.create({

        userId:
        req.user._id,

        productOrderId:
        order._id,

        orderId:
        razorpayOrder.id,

        amount:
        order.totalAmount,

        status:"created",

        orderType:"product"

      });

    }else{

      payment.orderId =
        razorpayOrder.id;

      payment.amount =
        order.totalAmount;

      payment.status =
        "created";

      await payment.save();

    }

    order.razorpayOrderId =
      razorpayOrder.id;

    await order.save();

    res.status(200).json({

      success:true,

      orderId:
      razorpayOrder.id,

      amount:
      razorpayOrder.amount,

      currency:
      razorpayOrder.currency,

      keyId:
      process.env.RAZORPAY_KEY_ID

    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

exports.verifyProductPayment =
async(req,res)=>{

  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  if(
    !orderId ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ){

    return res.status(400).json({
      success:false,
      message:
      "orderId, Razorpay payment details and signature are required"
    });

  }

  const generatedSignature =
  crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${razorpay_order_id}|${razorpay_payment_id}`
    )
    .digest("hex");

  const signaturesMatch =
    generatedSignature.length ===
    razorpay_signature.length &&
    crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature)
    );

  if(!signaturesMatch){

    return res.status(400).json({
      success:false,
      message:"Invalid Razorpay signature"
    });

  }

  const order =
  await Order.findOne({
    _id:orderId,
    userId:req.user._id
  });

  if(!order){

    return res.status(404).json({
      success:false,
      message:"Order not found"
    });

  }

  if(
    order.razorpayOrderId !==
    razorpay_order_id
  ){

    return res.status(400).json({
      success:false,
      message:"Razorpay order does not match local order"
    });

  }

  if(order.paymentStatus === "paid"){

    return res.status(200).json({
      success:true,
      message:"Payment already verified",
      data:{
        orderId:order._id,
        paymentStatus:order.paymentStatus,
        orderStatus:order.orderStatus
      }
    });

  }

  // Confirm the Razorpay order amount/currency from Razorpay
  // before changing the local order to paid.
  try{

    const razorpayOrder =
    await razorpay.orders.fetch(
      razorpay_order_id
    );

    const expectedAmount =
      Math.round(
        order.totalAmount * 100
      );

    if(
      Number(razorpayOrder.amount) !==
      expectedAmount ||
      razorpayOrder.currency !== "INR"
    ){

      return res.status(400).json({
        success:false,
        message:
        "Razorpay order amount or currency does not match"
      });

    }

  }catch(error){

    return res.status(400).json({
      success:false,
      message:
      "Unable to validate Razorpay order"
    });

  }

  const session =
  await mongoose.startSession();

  try{

    let processedOrder;

    await session.withTransaction(
      async()=>{

        processedOrder =
        await processSuccessfulProductPayment({
          order,
          razorpayPaymentId:
          razorpay_payment_id,
          razorpaySignature:
          razorpay_signature,
          session
        });

      }
    );

    return res.status(200).json({

      success:true,

      message:
      "Payment verified successfully",

      data:{
        orderId:
        processedOrder._id,

        paymentStatus:
        processedOrder.paymentStatus,

        orderStatus:
        processedOrder.orderStatus
      }

    });

  }catch(error){

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }finally{

    await session.endSession();

  }

};

exports.failProductPayment =
async(req,res)=>{

  try{

    const order =
    await Order.findOne({
      _id:req.params.orderId,
      userId:req.user._id
    });

    if(!order){

      return res.status(404).json({
        success:false,
        message:"Order not found"
      });

    }

    if(order.paymentStatus === "paid"){

      return res.status(400).json({
        success:false,
        message:
        "A paid order cannot be marked failed"
      });

    }

    order.paymentStatus =
      "failed";

    await order.save();

    await Payment.findOneAndUpdate(
      {
        productOrderId:order._id,
        orderType:"product"
      },
      {
        status:"failed"
      },
      {
        new:true
      }
    );

    res.status(200).json({
      success:true,
      message:"Product payment marked as failed",
      order
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};
