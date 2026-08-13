const mongoose =
require("mongoose");

const productSchema =
new mongoose.Schema({

 name:{
   type:String,
   required:true
 },

 categoryId:{
   type:
   mongoose.Schema.Types.ObjectId,
   ref:"Category",
   required:true
 },

 brand:{
   type:String,
   required:true
 },

 description:String,

 price:{
   type:Number,
   required:true
 },

 salePrice:{
   type:Number,
   default:0
 },

 stock:{
   type:Number,
   default:0
 },

images:{
  type:[String],
  default:[]
},
 
 flavors:[String],

 weight:String,

 status:{
   type:Boolean,
   default:true
 }

},{
 timestamps:true
});

module.exports =
mongoose.model(
"Product",
productSchema
);