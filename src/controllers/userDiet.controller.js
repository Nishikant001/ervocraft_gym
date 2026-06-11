const UserDiet =
require("../models/UserDiet");

const DietProgress =
require("../models/DietProgress");

const DietTemplate =
require("../models/DietTemplate");

const User =
require("../models/User");

exports.assignDiet =
async(req,res)=>{

 try{

   const {

     userId,
     dietTemplateId,
     startDate,
     endDate,
     notes

   } = req.body;

   const diet =
   await UserDiet.create({

      userId,

      dietTemplateId,

      assignedBy:
      req.user._id,

      startDate,

      endDate,

      notes

   });

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

exports.getMyDiets =
async(req,res)=>{

 try{

   const diets =
   await UserDiet
   .find({
      userId:req.user._id
   })
   .populate({
      path:
      "dietTemplateId",

      populate:{
        path:"goalGroupId"
      }
   });

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

exports.saveDietProgress =
async(req,res)=>{

 try{

   const {

     userDietId,

     breakfastCompleted,

     lunchCompleted,

     dinnerCompleted,

     snacksCompleted,

     waterIntake,

     caloriesConsumed

   } = req.body;

   const progress =
   await DietProgress.create({

      userId:
      req.user._id,

      userDietId,

      breakfastCompleted,

      lunchCompleted,

      dinnerCompleted,

      snacksCompleted,

      waterIntake,

      caloriesConsumed

   });

   res.status(201).json({

      success:true,

      progress

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};

exports.getDietProgress =
async(req,res)=>{

 try{

   const history =
   await DietProgress
   .find({
      userId:req.user._id
   })
   .sort({
      createdAt:-1
   });

   res.status(200).json({

      success:true,

      history

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};