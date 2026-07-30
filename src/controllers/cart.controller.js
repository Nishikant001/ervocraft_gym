const Cart =
require("../models/Cart");

const Product =
require("../models/Product");

exports.addToCart =
async(req,res)=>{

 try{

   const {
      productId,
      quantity
   } = req.body;

   let cart =
   await Cart.findOne({
      userId:req.user._id
   });

   if(!cart){

      cart =
      await Cart.create({
         userId:req.user._id,
         items:[]
      });

   }

   const existing =
   cart.items.find(
     item =>
     item.productId.toString()
     === productId
   );

   if(existing){

      existing.quantity +=
      quantity;

   }else{

      cart.items.push({
        productId,
        quantity
      });

   }

   await cart.save();

   res.status(200).json({
      success:true,
      cart
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

exports.getCart =
async(req,res)=>{

 try{

   const cart =
   await Cart.findOne({
      userId:req.user._id
   })
   .populate(
      "items.productId"
   );

   res.status(200).json({
      success:true,
      cart
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

exports.removeCartItem =
async(req,res)=>{

 try{

   const cart =
   await Cart.findOne({
      userId:req.user._id
   });

   cart.items =
   cart.items.filter(
      item =>
      item.productId.toString()
      !== req.params.productId
   );

   await cart.save();

   res.status(200).json({
      success:true,
      cart
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};