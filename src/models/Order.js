const mongoose =
require("mongoose");

const orderSchema =
new mongoose.Schema({

 userId:{
   type:
   mongoose.Schema.Types.ObjectId,
   ref:"User",
   required:true
 },

 items:[
   {
     productId:{
       type:
       mongoose.Schema.Types.ObjectId,
       ref:"Product"
     },

     productName:String,

     quantity:Number,

     price:Number
   }
 ],

 totalAmount:{
   type:Number,
   required:true
 },

 paymentId:String,

 razorpayOrderId:{
   type:String,
   default:""
 },

 razorpayPaymentId:{
   type:String,
   default:""
 },

 razorpaySignature:{
   type:String,
   default:""
 },

 stockCommitted:{
   type:Boolean,
   default:false
 },

 cartCleared:{
   type:Boolean,
   default:false
 },

 paidAt:Date,

 confirmedAt:Date,

 paymentStatus:{
   type:String,
   enum:[
     "pending",
     "paid",
     "failed"
   ],
   default:"pending"
 },

 orderStatus:{
   type:String,
   enum:[
     "pending",
     "confirmed",
     "packed",
     "shipped",
     "delivered",
     "cancelled"
   ],
   default:"pending"
 },

 shippingAddress:{
   type:String,
   required:true
 }

},{
 timestamps:true
});

module.exports =
mongoose.model(
"Order",
orderSchema
);