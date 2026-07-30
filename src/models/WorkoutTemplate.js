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

 estimatedCalories:Number,

 estimatedDuration:Number,

 difficulty:{
   type:String,
   enum:[
     "beginner",
     "intermediate",
     "advanced"
   ],
   default:"beginner"
 },

 days:[
   {

     day:{
       type:String
     },

     exercises:[
       {

         exerciseId:{
           type:
           mongoose.Schema.Types.ObjectId,
           ref:"Exercise",
           required:true
         },

         sets:{
           type:Number,
           default:3
         },

         reps:{
           type:Number,
           default:12
         },

         durationSeconds:{
           type:Number,
           default:60
         },

         restSeconds:{
           type:Number,
           default:30
         },

         order:{
           type:Number,
           default:1
         }

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