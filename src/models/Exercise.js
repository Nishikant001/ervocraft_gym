const mongoose = require("mongoose");

const exerciseSchema =
new mongoose.Schema({

  name:{
    type:String,
    required:true,
    unique:true
  },

  muscleGroup:{
    type:String,
    enum:[
      "chest",
      "back",
      "shoulders",
      "biceps",
      "triceps",
      "legs",
      "abs",
      "cardio",
      "full_body"
    ],
    required:true
  },

  equipment:{
    type:String,
    enum:[
      "bodyweight",
      "dumbbell",
      "barbell",
      "machine",
      "cable",
      "kettlebell"
    ],
    default:"bodyweight"
  },

  difficulty:{
    type:String,
    enum:[
      "beginner",
      "intermediate",
      "advanced"
    ],
    default:"beginner"
  },

  description:String,

  instructions:[String],

  videoUrl:String,

  thumbnail:String,

  caloriesBurnPerMinute:{
    type:Number,
    default:5
  },

  isActive:{
    type:Boolean,
    default:true
  }

},{
  timestamps:true
});

module.exports =
mongoose.model(
  "Exercise",
  exerciseSchema
);