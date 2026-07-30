const Payment =
require("../models/Payment");

const User =
require("../models/User");

const UserSubscription =
require("../models/UserSubscription");

const WorkoutSession =
require("../models/WorkoutSession");

const DietProgress =
require("../models/DietProgress");

exports.revenueReport =
async(req,res)=>{

 try{

   const report =
   await Payment.aggregate([

      {
        $match:{
          status:"success"
        }
      },

      {
        $group:{

          _id:{
            $dateToString:{
              format:"%Y-%m",
              date:"$createdAt"
            }
          },

          revenue:{
            $sum:"$amount"
          }

        }
      },

      {
        $sort:{
          _id:1
        }
      }

   ]);

   res.status(200).json({
      success:true,
      report
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

exports.membershipReport =
async(req,res)=>{

 try{

   const report =
   await UserSubscription.aggregate([

      {
        $group:{

          _id:"$status",

          count:{
            $sum:1
          }

        }
      }

   ]);

   res.status(200).json({
      success:true,
      report
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

exports.workoutReport =
async(req,res)=>{

 try{

   const report =
   await WorkoutSession.aggregate([

      {
        $match:{
          status:"completed"
        }
      },

      {
        $group:{

          _id:{
            $dateToString:{
              format:"%Y-%m",
              date:"$createdAt"
            }
          },

          workouts:{
            $sum:1
          },

          calories:{
            $sum:
            "$caloriesBurned"
          }

        }
      }

   ]);

   res.status(200).json({
      success:true,
      report
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

exports.dietReport =
async(req,res)=>{

 try{

   const report =
   await DietProgress.aggregate([

      {
        $group:{

          _id:null,

          breakfast:{
            $sum:{
              $cond:[
                "$breakfastCompleted",
                1,
                0
              ]
            }
          },

          lunch:{
            $sum:{
              $cond:[
                "$lunchCompleted",
                1,
                0
              ]
            }
          },

          dinner:{
            $sum:{
              $cond:[
                "$dinnerCompleted",
                1,
                0
              ]
            }
          }

        }
      }

   ]);

   res.status(200).json({
      success:true,
      report
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

