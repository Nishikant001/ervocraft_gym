const Branch =
require("../models/Branch");

const User =
require("../models/User");

const Payment =
require("../models/Payment");

const UserSubscription =
require("../models/UserSubscription");

const UserWorkout =
require("../models/UserWorkout");

const WorkoutSession =
require("../models/WorkoutSession");

exports.getRevenueByBranch =
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
        $lookup:{
          from:"users",
          localField:"userId",
          foreignField:"_id",
          as:"user"
        }
      },

      {
        $unwind:"$user"
      },

      {
        $group:{
          _id:"$user.branchId",

          totalRevenue:{
            $sum:"$amount"
          },

          totalPayments:{
            $sum:1
          }
        }
      },

      {
        $lookup:{
          from:"branches",
          localField:"_id",
          foreignField:"_id",
          as:"branch"
        }
      },

      {
        $unwind:"$branch"
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

exports.getMembersByBranch =
async(req,res)=>{

 try{

   const report =
   await User.aggregate([

      {
        $match:{
          role:"user"
        }
      },

      {
        $group:{
          _id:"$branchId",

          totalUsers:{
            $sum:1
          }
        }
      },

      {
        $lookup:{
          from:"branches",
          localField:"_id",
          foreignField:"_id",
          as:"branch"
        }
      },

      {
        $unwind:"$branch"
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

exports.getMembershipAnalytics =
async(req,res)=>{

 try{

   const report =
   await UserSubscription.aggregate([

      {
        $match:{
          status:"active"
        }
      },

      {
        $lookup:{
          from:"users",
          localField:"userId",
          foreignField:"_id",
          as:"user"
        }
      },

      {
        $unwind:"$user"
      },

      {
        $group:{

          _id:
          "$user.branchId",

          activeMembers:{
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

exports.getWorkoutAnalytics =
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
        $lookup:{
          from:"users",
          localField:"userId",
          foreignField:"_id",
          as:"user"
        }
      },

      {
        $unwind:"$user"
      },

      {
        $group:{

          _id:
          "$user.branchId",

          totalCompleted:{
            $sum:1
          },

          totalCalories:{
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

exports.getDashboardAnalytics =
async(req,res)=>{

 try{

   const totalBranches =
   await Branch.countDocuments();

   const totalUsers =
   await User.countDocuments({
      role:"user"
   });

   const activeMembers =
   await UserSubscription.countDocuments({
      status:"active"
   });

   const revenue =
   await Payment.aggregate([
     {
       $match:{
         status:"success"
       }
     },
     {
       $group:{
         _id:null,
         total:{
           $sum:"$amount"
         }
       }
     }
   ]);

   res.status(200).json({

      success:true,

      data:{

         totalBranches,

         totalUsers,

         activeMembers,

         totalRevenue:
         revenue[0]?.total || 0

      }

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};