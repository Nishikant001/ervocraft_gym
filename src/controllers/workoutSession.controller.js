const WorkoutSession =
require(
"../models/WorkoutSession"
);

const WorkoutExerciseProgress =
require(
"../models/WorkoutExerciseProgress"
);

const UserWorkout =
require(
"../models/UserWorkout"
);

const Exercise =
require(
"../models/Exercise"
);

exports.startWorkout =
async(req,res)=>{

 try{

   const {
     userWorkoutId
   } = req.body;

   const session =
   await WorkoutSession.create({

      userId:
      req.user._id,

      userWorkoutId

   });

   res.status(201).json({

      success:true,

      session

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};

exports.completeExercise =
async(req,res)=>{

 try{

   const {

      sessionId,

      exerciseId,

      setsCompleted,

      repsCompleted,

      durationCompleted

   } = req.body;

   const exercise =
   await Exercise.findById(
      exerciseId
   );

   const calories =
   (
      durationCompleted / 60
   ) *
   exercise.caloriesBurnPerMinute;

   const progress =
   await WorkoutExerciseProgress
   .create({

      sessionId,

      exerciseId,

      setsCompleted,

      repsCompleted,

      durationCompleted,

      caloriesBurned:
      calories,

      completed:true

   });

   res.status(200).json({

      success:true,

      progress

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};

exports.finishWorkout =
async(req,res)=>{

 try{

   const {
      sessionId
   } = req.body;

   const progresses =
   await WorkoutExerciseProgress
   .find({
      sessionId
   });

   const calories =
   progresses.reduce(
     (sum,item)=>
     sum +
     item.caloriesBurned,
     0
   );

   const session =
   await WorkoutSession
   .findById(sessionId);

   session.status =
   "completed";

   session.completedAt =
   new Date();

   session.caloriesBurned =
   calories;

   session.totalDuration =
   Math.floor(
      (
       session.completedAt -
       session.startedAt
      ) / 1000
   );

   await session.save();

   res.status(200).json({

      success:true,

      session

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};

exports.getWorkoutHistory =
async(req,res)=>{

 try{

   const sessions =
   await WorkoutSession
   .find({

      userId:
      req.user._id

   })
   .sort({
      createdAt:-1
   });

   res.status(200).json({

      success:true,

      sessions

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};