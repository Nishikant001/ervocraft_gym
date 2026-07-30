const mongoose = require("mongoose");

const notificationSchema =
new mongoose.Schema({

 title:{
   type:String,
   required:true
 },

 message:{
   type:String,
   required:true
 },

 targetType:{
   type:String,
   enum:[
     "all",
     "branch",
     "user"
   ],
   default:"all"
 },

 branchId:{
   type:
   mongoose.Schema.Types.ObjectId,
   ref:"Branch"
 },

 userId:{
   type:
   mongoose.Schema.Types.ObjectId,
   ref:"User"
 },

 status:{
   type:Boolean,
   default:true
 }

},{
 timestamps:true
});

module.exports =
mongoose.model(
 "Notification",
 notificationSchema
);