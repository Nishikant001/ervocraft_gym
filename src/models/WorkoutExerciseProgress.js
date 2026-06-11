const mongoose =
require("mongoose");

const progressSchema =
new mongoose.Schema({

 sessionId:{
   type:
   mongoose.Schema.Types.ObjectId,
   ref:"WorkoutSession"
 },

 exerciseId:{
   type:
   mongoose.Schema.Types.ObjectId,
   ref:"Exercise"
 },

 setsCompleted:Number,

 repsCompleted:Number,

 durationCompleted:Number,

 caloriesBurned:Number,

 completed:{
   type:Boolean,
   default:false
 }

},{
 timestamps:true
});

module.exports =
mongoose.model(
"WorkoutExerciseProgress",
progressSchema
);