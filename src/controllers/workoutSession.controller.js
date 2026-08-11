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

// exports.startWorkout =
// async(req,res)=>{

//  try{

//    const {
//      userWorkoutId
//    } = req.body;

//    const session =
//    await WorkoutSession.create({

//       userId:
//       req.user._id,

//       userWorkoutId

//    });

//    res.status(201).json({

//       success:true,

//       session

//    });

//  }catch(error){

//    res.status(500).json({

//       success:false,

//       message:error.message

//    });

//  }

// };

exports.startWorkout = async (req, res) => {

  try {

    const { userWorkoutId } = req.body;

    // =========================================
    // 1. FIND USER WORKOUT
    // =========================================

    const userWorkout =
      await UserWorkout.findOne({
        _id: userWorkoutId,
        userId: req.user._id
      }).populate("workoutTemplateId");

    if (!userWorkout) {

      return res.status(404).json({
        success: false,
        message: "Workout assignment not found."
      });

    }

    // =========================================
    // 2. CHECK IF A SESSION IS ALREADY RUNNING
    // =========================================

    const activeSession =
      await WorkoutSession.findOne({
        userId: req.user._id,
        userWorkoutId: userWorkoutId,
        status: "in_progress"
      });

    if (activeSession) {

      return res.status(200).json({
        success: true,
        message: "You already have a workout in progress.",
        session: activeSession
      });

    }

    // =========================================
    // 3. FIND COMPLETED SESSIONS
    // =========================================

    const completedSessions =
      await WorkoutSession.find({
        userId: req.user._id,
        userWorkoutId: userWorkoutId,
        status: "completed"
      }).sort({
        day: 1
      });

    // =========================================
    // 4. DETERMINE NEXT DAY
    // =========================================

    const completedDays =
      completedSessions.map(
        session => session.day
      );

    let nextDay = 1;

    while (
      completedDays.includes(nextDay)
    ) {
      nextDay++;
    }

    // =========================================
    // 5. CHECK IF PROGRAM IS FINISHED
    // =========================================

    const workoutTemplate =
      userWorkout.workoutTemplateId;

    const availableDays =
      workoutTemplate?.days || [];

    const selectedDay =
      availableDays.find(
        item =>
          Number(item.day) === nextDay
      );

    if (!selectedDay) {

      return res.status(400).json({
        success: false,
        message: "You have completed this workout program."
      });

    }

    // =========================================
    // 6. CREATE WORKOUT SESSION
    // =========================================

    const session =
      await WorkoutSession.create({

        userId: req.user._id,

        userWorkoutId,

        day: nextDay

      });

    // =========================================
    // 7. RETURN SESSION
    // =========================================

    res.status(201).json({

      success: true,

      message:
        `Day ${nextDay} workout started successfully.`,

      session

    });

  } catch (error) {

    console.log(
      "Start Workout Error:",
      error
    );

    res.status(500).json({

      success: false,

      message: error.message

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