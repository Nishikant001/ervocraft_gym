const Exercise =
require("../models/Exercise");

// CREATE
exports.createExercise =
async(req,res)=>{

 try{

   const exercise =
   await Exercise.create({
     ...req.body,
     thumbnail:
     req.files && req.files.thumbnail ?
     req.files.thumbnail[0].path :
     req.body.thumbnail,
     videoUrl:
     req.files && req.files.video ?
     req.files.video[0].path :
     req.body.videoUrl
   });

   res.status(201).json({
      success:true,
      exercise
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// GET ALL
exports.getExercises =
async(req,res)=>{

 try{

   const exercises =
   await Exercise.find({
      isActive:true
   });

   res.status(200).json({
      success:true,
      exercises
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// GET SINGLE
exports.getExerciseById =
async(req,res)=>{

 try{

   const exercise =
   await Exercise.findById(
      req.params.id
   );

   if(!exercise){

      return res.status(404)
      .json({
         success:false,
         message:
         "Exercise not found"
      });

   }

   res.status(200).json({
      success:true,
      exercise
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// UPDATE
exports.updateExercise =
async(req,res)=>{

 try{

   const updateData = {
     ...req.body
   };

   if(req.files && req.files.thumbnail){
     updateData.thumbnail =
     req.files.thumbnail[0].path;
   }

   if(req.files && req.files.video){
     updateData.videoUrl =
     req.files.video[0].path;
   }

   const exercise =
   await Exercise.findByIdAndUpdate(
      req.params.id,
      updateData,
      {new:true}
   );

   res.status(200).json({
      success:true,
      exercise
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// DELETE
exports.deleteExercise =
async(req,res)=>{

 try{

   await Exercise.findByIdAndDelete(
      req.params.id
   );

   res.status(200).json({
      success:true,
      message:
      "Exercise deleted"
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};