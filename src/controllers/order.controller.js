const Order =
require("../models/Order");

const Cart =
require("../models/Cart");

const Product =
require("../models/Product");

exports.createOrder =
async(req,res)=>{

 try{

   const cart =
   await Cart.findOne({
      userId:req.user._id
   })
   .populate(
      "items.productId"
   );

   if(
      !cart ||
      cart.items.length === 0
   ){

      return res.status(400)
      .json({
        success:false,
        message:
        "Cart is empty"
      });

   }

   let total = 0;

   const items =
   cart.items.map(item=>{

      const price =
      item.productId.salePrice ||
      item.productId.price;

      total +=
      price *
      item.quantity;

      return {

        productId:
        item.productId._id,

        productName:
        item.productId.name,

        quantity:
        item.quantity,

        price

      };

   });

   const order =
   await Order.create({

      userId:
      req.user._id,

      items,

      totalAmount:
      total,

      shippingAddress:
      req.body.shippingAddress

   });

   res.status(201).json({

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

exports.getMyOrders =
async(req,res)=>{

 try{

   const orders =
   await Order.find({

      userId:
      req.user._id

   }).sort({
      createdAt:-1
   });

   res.status(200).json({

      success:true,

      orders

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};

exports.updateOrderStatus =
async(req,res)=>{

 try{

   const order =
   await Order.findByIdAndUpdate(

      req.params.id,

      {
        orderStatus:
        req.body.orderStatus
      },

      {
        new:true
      }

   );

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