const UserFitnessProfile =
require(
"../models/UserFitnessProfile"
);

// CREATE OR UPDATE
exports.saveProfile =
async(req,res)=>{

 try{

   const {

     gender,
     age,
     height,
     weight,
     targetWeight,
     bodyFat,
     activityLevel,
     fitnessGoal,
     medicalConditions,
     notes

   } = req.body;

   const bmi =
   Number(
    (
      weight /
      (
       (height/100) *
       (height/100)
      )
    ).toFixed(2)
   );

   const profile =
   await UserFitnessProfile
   .findOneAndUpdate(

      {
        userId:
        req.user._id
      },

      {
        gender,
        age,
        height,
        weight,
        targetWeight,
        bodyFat,
        bmi,
        activityLevel,
        fitnessGoal,
        medicalConditions,
        notes
      },

      {
        upsert:true,
        new:true
      }

   );

   res.status(200).json({

      success:true,

      profile

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};

exports.getProfile =
async(req,res)=>{

 try{

   const profile =
   await UserFitnessProfile
   .findOne({
      userId:req.user._id
   });

   res.status(200).json({
      success:true,
      profile
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

exports.getUserFitnessProfile =
async(req,res)=>{

 try{

   const profile =
   await UserFitnessProfile
   .findOne({
      userId:req.params.userId
   });

   res.status(200).json({
      success:true,
      profile
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};