const Category =
require("../models/Category");

// CREATE
exports.createCategory =
async(req,res)=>{

 try{

   const category =
   await Category.create(
     req.body
   );

   res.status(201).json({
      success:true,
      category
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// GET ALL
exports.getCategories =
async(req,res)=>{

 try{

   const categories =
   await Category.find();

   res.status(200).json({
      success:true,
      categories
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// UPDATE
exports.updateCategory =
async(req,res)=>{

 try{

   const category =
   await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
   );

   res.status(200).json({
      success:true,
      category
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// DELETE
exports.deleteCategory =
async(req,res)=>{

 try{

   await Category.findByIdAndDelete(
      req.params.id
   );

   res.status(200).json({
      success:true,
      message:
      "Category deleted"
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};