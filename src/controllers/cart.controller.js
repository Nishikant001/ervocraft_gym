const Cart =
require("../models/Cart");

const Product =
require("../models/Product");

// exports.addToCart =
// async(req,res)=>{

//  try{

//    const {
//       productId,
//       quantity
//    } = req.body;

//    let cart =
//    await Cart.findOne({
//       userId:req.user._id
//    });

//    if(!cart){

//       cart =
//       await Cart.create({
//          userId:req.user._id,
//          items:[]
//       });

//    }

//    const existing =
//    cart.items.find(
//      item =>
//      item.productId.toString()
//      === productId
//    );

//    if(existing){

//       existing.quantity +=
//       quantity;

//    }else{

//       cart.items.push({
//         productId,
//         quantity
//       });

//    }

//    await cart.save();

//    res.status(200).json({
//       success:true,
//       cart
//    });

//  }catch(error){

//    res.status(500).json({
//       success:false,
//       message:error.message
//    });

//  }

// };

exports.addToCart =
async(req,res)=>{

  try{

    const {
      productId,
      quantity = 1
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

    // PRODUCT ALREADY IN CART
    if(existing){

      return res.status(200).json({

        success:true,

        alreadyInCart:true,

        message:
        "Product already exists in cart",

        cart

      });

    }

    // ADD NEW PRODUCT
    cart.items.push({

      productId,

      quantity

    });


    await cart.save();


    res.status(200).json({

      success:true,

      alreadyInCart:false,

      message:
      "Product added to cart",

      cart

    });


  }catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};
exports.updateCartQuantity =
async(req,res)=>{

  try{

    const {
      quantity
    } = req.body;


    // Quantity must be at least 1
    if(
      quantity === undefined ||
      Number(quantity) < 1
    ){

      return res.status(400).json({

        success:false,

        message:
        "Quantity must be at least 1"

      });

    }


    const cart =
    await Cart.findOne({

      userId:req.user._id

    });


    if(!cart){

      return res.status(404).json({

        success:false,

        message:
        "Cart not found"

      });

    }


    const item =
    cart.items.find(

      item =>
      item.productId.toString()
      === req.params.productId

    );


    if(!item){

      return res.status(404).json({

        success:false,

        message:
        "Product not found in cart"

      });

    }


    item.quantity =
    Number(quantity);


    await cart.save();


    await cart.populate(
      "items.productId"
    );


    res.status(200).json({

      success:true,

      message:
      "Cart quantity updated",

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

// exports.removeCartItem =
// async(req,res)=>{

//  try{

//    const cart =
//    await Cart.findOne({
//       userId:req.user._id
//    });

//    cart.items =
//    cart.items.filter(
//       item =>
//       item.productId.toString()
//       !== req.params.productId
//    );

//    await cart.save();

//    res.status(200).json({
//       success:true,
//       cart
//    });

//  }catch(error){

//    res.status(500).json({
//       success:false,
//       message:error.message
//    });

//  }

// };

exports.removeCartItem =
async(req,res)=>{

  try{

    const cart =
    await Cart.findOne({
      userId:req.user._id
    });


    if(!cart){

      return res.status(404).json({

        success:false,

        message:
        "Cart not found"

      });

    }


    cart.items =
    cart.items.filter(

      item =>
      item.productId.toString()
      !== req.params.productId

    );


    await cart.save();


    // Populate product details before
    // sending updated cart to frontend

    await cart.populate(
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