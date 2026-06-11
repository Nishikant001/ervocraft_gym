const mongoose =
require("mongoose");

const bannerSchema =
new mongoose.Schema({

 title:String,

 image:String,

 redirectType:{
   type:String,
   enum:[
     "offer",
     "subscription",
     "external"
   ]
 },

 redirectValue:String,

 status:{
   type:Boolean,
   default:true
 }

},{
 timestamps:true
});

module.exports =
mongoose.model(
 "Banner",
 bannerSchema
);