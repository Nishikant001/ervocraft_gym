const GoalGroup =
require("../models/GoalGroup");

// CREATE
exports.createGoal =
async(req,res)=>{

 try{

   const goal =
   await GoalGroup.create(
     req.body
   );

   res.status(201).json({
     success:true,
     goal
   });

 }catch(error){

   res.status(500).json({
     success:false,
     message:error.message
   });

 }

};

// GET ALL
exports.getGoals =
async(req,res)=>{

 try{

   const goals =
   await GoalGroup.find();

   res.status(200).json({
      success:true,
      goals
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// UPDATE
exports.updateGoal =
async(req,res)=>{

 try{

   const goal =
   await GoalGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
   );

   res.status(200).json({
      success:true,
      goal
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// DELETE
exports.deleteGoal =
async(req,res)=>{

 try{

   await GoalGroup.findByIdAndDelete(
      req.params.id
   );

   res.status(200).json({
      success:true,
      message:"Goal deleted"
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};