const mongoose = require("mongoose");

const userFitnessProfileSchema =
new mongoose.Schema({

  userId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    unique:true
  },

  gender:{
    type:String,
    enum:[
      "male",
      "female",
      "other"
    ]
  },

  age:Number,

  height:{
    type:Number,
    required:true
  },

  weight:{
    type:Number,
    required:true
  },

  targetWeight:{
    type:Number
  },

  bodyFat:{
    type:Number
  },

  bmi:{
    type:Number
  },

  activityLevel:{
    type:String,
    enum:[
      "sedentary",
      "light",
      "moderate",
      "active",
      "very_active"
    ]
  },

  fitnessGoal:{
    type:String,
    enum:[
      "weight_loss",
      "weight_gain",
      "muscle_gain",
      "lean_body",
      "general_fitness"
    ]
  },

  medicalConditions:[String],

  notes:String

},{
  timestamps:true
});

module.exports =
mongoose.model(
  "UserFitnessProfile",
  userFitnessProfileSchema
);