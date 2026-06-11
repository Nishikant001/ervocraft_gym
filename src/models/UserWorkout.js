const mongoose =
require("mongoose");

const userWorkoutSchema =
new mongoose.Schema({

  userId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  workoutTemplateId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"WorkoutTemplate",
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
"UserWorkout",
userWorkoutSchema
);