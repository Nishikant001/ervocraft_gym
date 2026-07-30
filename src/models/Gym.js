const mongoose =
require("mongoose");

const gymSchema =
new mongoose.Schema({

  name:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true
  },

  phone:String,

  logo:String,

  address:String,

  website:String,

  subscriptionPlan:{
    type:String,
    enum:[
      "starter",
      "professional",
      "enterprise"
    ],
    default:"starter"
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
"Gym",
gymSchema
);