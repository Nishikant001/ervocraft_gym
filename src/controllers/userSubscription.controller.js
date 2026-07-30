const UserSubscription =
require("../models/UserSubscription");

exports.getMySubscription =
async (req,res)=>{
 try{

   const subscription =
   await UserSubscription
   .findOne({
      userId:req.user._id
   })
   .populate(
      "subscriptionPlanId"
   );

   res.status(200).json({
      success:true,
      subscription
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }
};