const mongoose =
require("mongoose");

const userDietSchema =
new mongoose.Schema({

  userId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  dietTemplateId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"DietTemplate",
    required:true
  },

  assignedBy:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  startDate:{
    type:Date,
    required:true
  },

  endDate:{
    type:Date,
    required:true
  },

  status:{
    type:String,
    enum:[
      "assigned",
      "active",
      "completed",
      "expired"
    ],
    default:"assigned"
  },

  notes:String

},{
 timestamps:true
});

module.exports =
mongoose.model(
"UserDiet",
userDietSchema
);