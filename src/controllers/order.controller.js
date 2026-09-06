const Order =
require("../models/Order");

const Cart =
require("../models/Cart");

const getUnitPrice =
(product) =>
  product.salePrice &&
  product.salePrice > 0
    ? product.salePrice
    : product.price;

// Create an order from the authenticated user's cart.
// Prices and stock are always read from the database.
exports.createOrder =
async(req,res)=>{

 try{

   const shippingAddress =
   typeof req.body.shippingAddress === "string"
     ? req.body.shippingAddress.trim()
     : "";

   if(!shippingAddress){

      return res.status(400)
      .json({
        success:false,
        message:
        "Shipping address is required"
      });

   }

   const cart =
   await Cart.findOne({
      userId:req.user._id
   })
   .populate(
      "items.productId"
   );

   if(
      !cart ||
      !cart.items.length
   ){

      return res.status(400)
      .json({
        success:false,
        message:
        "Cart is empty"
      });

   }

   const items = [];
   let total = 0;

   for(const item of cart.items){

      if(!Number.isInteger(item.quantity) ||
         item.quantity <= 0){

        return res.status(400)
        .json({
          success:false,
          message:
          "Invalid cart quantity"
        });

      }

      const product =
      item.productId;

      if(!product ||
         !product.status){

        return res.status(400)
        .json({
          success:false,
          message:
          "One or more products are unavailable"
        });

      }

      if(product.stock < item.quantity){

        return res.status(400)
        .json({
          success:false,
          message:
          `Insufficient stock for ${product.name}`
        });

      }

      const price =
      getUnitPrice(product);

      const lineTotal =
      price * item.quantity;

      total += lineTotal;

      items.push({
        productId:product._id,
        productName:product.name,
        quantity:item.quantity,
        price
      });

   }

   const order =
   await Order.create({

      userId:
      req.user._id,

      items,

      totalAmount:
      total,

      shippingAddress,

      paymentStatus:"pending",
      orderStatus:"pending"

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
      userId:req.user._id
   })
   .populate("items.productId")
   .sort({
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

exports.getOrderById =
async(req,res)=>{

 try{

   const order =
   await Order.findOne({
      _id:req.params.id,
      userId:req.user._id
   })
   .populate("items.productId");

   if(!order){

      return res.status(404)
      .json({
        success:false,
        message:
        "Order not found"
      });

   }

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
        new:true,
        runValidators:true
      }
   );

   if(!order){

      return res.status(404)
      .json({
        success:false,
        message:
        "Order not found"
      });

   }

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
