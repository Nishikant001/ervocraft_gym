const mongoose =
require("mongoose");

const workoutSessionSchema =
new mongoose.Schema({

 userId:{
   type:
   mongoose.Schema.Types.ObjectId,
   ref:"User",
   required:true
 },

 userWorkoutId:{
   type:
   mongoose.Schema.Types.ObjectId,
   ref:"UserWorkout",
   required:true
 },

 startedAt:{
   type:Date,
   default:Date.now
 },

 completedAt:Date,

 totalDuration:{
   type:Number,
   default:0
 },

 caloriesBurned:{
   type:Number,
   default:0
 },

 status:{
   type:String,
   enum:[
    "in_progress",
    "completed"
   ],
   default:"in_progress"
 }

},{
 timestamps:true
});

module.exports =
mongoose.model(
"WorkoutSession",
workoutSessionSchema
);