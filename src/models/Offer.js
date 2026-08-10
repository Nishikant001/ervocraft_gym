const mongoose =
require("mongoose");

const offerSchema =
new mongoose.Schema({

 title:{
   type:String, 
   required:true
 },

 description:String,
 
 imageUrl: {
      type: String,
    },

 discountType:{
   type:String,
   enum:[
     "percentage",
     "fixed"
   ]
 },

 discountValue:Number,

 startDate:Date,

 endDate:Date,

 status:{
   type:Boolean,
   default:true
 }

},{
 timestamps:true
});

module.exports =
mongoose.model(
 "Offer",
 offerSchema
);