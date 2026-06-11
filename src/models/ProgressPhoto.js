const mongoose =
require("mongoose");

const progressPhotoSchema =
new mongoose.Schema({

 userId:{
   type:
   mongoose.Schema.Types.ObjectId,
   ref:"User",
   required:true
 },

 imageUrl:{
   type:String,
   required:true
 },

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
"ProgressPhoto",
progressPhotoSchema
);