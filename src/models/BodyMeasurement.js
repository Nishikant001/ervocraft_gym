const mongoose =
require("mongoose");

const bodyMeasurementSchema =
new mongoose.Schema({

 userId:{
   type:
   mongoose.Schema.Types.ObjectId,
   ref:"User",
   required:true
 },

 chest:Number,

 waist:Number,

 hips:Number,

 biceps:Number,

 thighs:Number,

 shoulders:Number,

 neck:Number,

 date:{
   type:Date,
   default:Date.now
 }

},{
 timestamps:true
});

module.exports =
mongoose.model(
"BodyMeasurement",
bodyMeasurementSchema
);