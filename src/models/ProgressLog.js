const mongoose =
require("mongoose");

const progressLogSchema =
new mongoose.Schema({

 userId:{
  type:
  mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 weight:{
  type:Number,
  required:true
 },

 bmi:Number,

 bodyFat:Number,

 muscleMass:Number,

 note:String,

 date:{
  type:Date,
  default:Date.now
 }

},{
 timestamps:true
});

module.exports =
mongoose.model(
"ProgressLog",
progressLogSchema
);