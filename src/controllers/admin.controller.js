const User = require("../models/User");
const Branch = require("../models/Branch");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const UserSubscription = require("../models/UserSubscription");
const Payment = require("../models/Payment");


exports.getDashboard =
async (req,res)=>{

 try{

   const totalUsers =
   await User.countDocuments({
      role:"user"
   });

   const totalBranches =
   await Branch.countDocuments();

   const totalPlans =
   await SubscriptionPlan.countDocuments();

   const activeMembers =
   await UserSubscription.countDocuments({
      status:"active"
   });

   const expiredMembers =
   await UserSubscription.countDocuments({
      status:"expired"
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
        totalUsers,
        totalBranches,
        totalPlans,
        activeMembers,
        expiredMembers,
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


exports.getUsers =
async (req,res)=>{

 try{

   const users =
   await User.find({
      role:"user"
   })
   .populate("branchId")
   .populate(
      "subscriptionPlanId"
   );

   res.status(200).json({
      success:true,
      users
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

exports.getUserById =
async (req,res)=>{

 try{

   const user =
   await User.findById(
      req.params.id
   )
   .populate("branchId")
   .populate(
      "subscriptionPlanId"
   );

   if(!user){

      return res.status(404)
      .json({
        success:false,
        message:
        "User not found"
      });

   }

   res.status(200).json({
      success:true,
      user
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

exports.changeUserStatus =
async (req,res)=>{

 try{

   const user =
   await User.findById(
      req.params.id
   );

   if(!user){

      return res.status(404)
      .json({
        success:false,
        message:
        "User not found"
      });

   }

   user.isActive =
   !user.isActive;

   await user.save();

   res.status(200).json({

      success:true,

      message:
      user.isActive
      ?
      "User Activated"
      :
      "User Deactivated"

   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

exports.deleteUser =
async (req,res)=>{

 try{

   await User.findByIdAndDelete(
      req.params.id
   );

   res.status(200).json({
      success:true,
      message:
      "User deleted"
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};