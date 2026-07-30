const DietTemplate =
require("../models/DietTemplate");

// CREATE
exports.createDiet =
async(req,res)=>{

 try{

   const diet =
   await DietTemplate.create(
      req.body
   );

   res.status(201).json({
      success:true,
      diet
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// GET ALL
exports.getDiets =
async(req,res)=>{

 try{

   const diets =
   await DietTemplate.find()
   .populate("goalGroupId");

   res.status(200).json({
      success:true,
      diets
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// GET SINGLE
exports.getDietById =
async(req,res)=>{

 try{

   const diet =
   await DietTemplate.findById(
      req.params.id
   )
   .populate("goalGroupId");

   res.status(200).json({
      success:true,
      diet
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// UPDATE
exports.updateDiet =
async(req,res)=>{

 try{

   const diet =
   await DietTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
   );

   res.status(200).json({
      success:true,
      diet
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// DELETE
exports.deleteDiet =
async(req,res)=>{

 try{

   await DietTemplate.findByIdAndDelete(
      req.params.id
   );

   res.status(200).json({
      success:true,
      message:"Diet deleted"
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};