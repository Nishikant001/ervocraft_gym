const mongoose =
require("mongoose");

const workoutSchema =
new mongoose.Schema({

 goalGroupId:{
   type:
   mongoose.Schema.Types.ObjectId,
   ref:"GoalGroup"
 },

 title:{
   type:String,
   required:true
 },

 description:String,

 days:[
   {
     day:String,

     exercises:[
       {
         name:String,

         sets:Number,

         reps:Number
       }
     ]
   }
 ]

},{
 timestamps:true
});

module.exports =
mongoose.model(
"WorkoutTemplate",
workoutSchema
);