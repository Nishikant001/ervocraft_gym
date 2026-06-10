const Trainer =
require("../models/Trainer");

exports.createTrainer =
async(req,res)=>{

 try{

   const trainer =
   await Trainer.create(
     req.body
   );

   res.status(201).json({
     success:true,
     trainer
   });

 }catch(error){

   res.status(500).json({
     success:false,
     message:error.message
   });

 }

};

exports.getTrainers =
async(req,res)=>{

 try{

   const trainers =
   await Trainer.find()
   .populate("branchId");

   res.status(200).json({
      success:true,
      trainers
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

exports.updateTrainer =
async(req,res)=>{

 try{

   const trainer =
   await Trainer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
   );

   res.status(200).json({
      success:true,
      trainer
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

exports.deleteTrainer =
async(req,res)=>{

 try{

   await Trainer.findByIdAndDelete(
      req.params.id
   );

   res.status(200).json({
      success:true,
      message:"Trainer deleted"
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};