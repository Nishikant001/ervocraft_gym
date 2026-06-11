const Product =
require("../models/Product");

// CREATE
exports.createProduct =
async(req,res)=>{

 try{

   const product =
   await Product.create(
      req.body
   );

   res.status(201).json({
      success:true,
      product
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// GET ALL
exports.getProducts =
async(req,res)=>{

 try{

   const products =
   await Product.find()
   .populate("categoryId");

   res.status(200).json({
      success:true,
      products
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// GET SINGLE
exports.getProductById =
async(req,res)=>{

 try{

   const product =
   await Product.findById(
      req.params.id
   )
   .populate("categoryId");

   res.status(200).json({
      success:true,
      product
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// UPDATE
exports.updateProduct =
async(req,res)=>{

 try{

   const product =
   await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
   );

   res.status(200).json({
      success:true,
      product
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// DELETE
exports.deleteProduct =
async(req,res)=>{

 try{

   await Product.findByIdAndDelete(
      req.params.id
   );

   res.status(200).json({
      success:true,
      message:
      "Product deleted"
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};