const UserWorkout =
require("../models/UserWorkout");

const User =
require("../models/User");

const WorkoutTemplate =
require("../models/WorkoutTemplate");

// exports.assignWorkout =
// async(req,res)=>{

//  try{

//    const {

//       userId,
//       workoutTemplateId,
//       startDate,
//       endDate,
//       notes

//    } = req.body;

//    const user =
//    await User.findById(userId);

//    if(!user){

//       return res.status(404)
//       .json({
//          success:false,
//          message:"User not found"
//       });

//    }

//    const workout =
//    await WorkoutTemplate.findById(
//       workoutTemplateId
//    );

//    if(!workout){

//       return res.status(404)
//       .json({
//          success:false,
//          message:"Workout not found"
//       });

//    }

//    const assignment =
//    await UserWorkout.create({

//       userId,

//       workoutTemplateId,

//       assignedBy:
//       req.user._id,

//       startDate,

//       endDate,

//       notes

//    });

//    res.status(201).json({

//       success:true,

//       assignment

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

    const {
      workoutTemplateId,
      startDate,
      endDate,
      notes
    } = req.body;

    // Logged-in user
    const userId = req.user._id;

    // Check user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check workout template
    const workout = await WorkoutTemplate.findById(
      workoutTemplateId
    );

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found"
      });
    }

    // Check if user already started this workout
    const existingWorkout =
      await UserWorkout.findOne({
        userId,
        workoutTemplateId,
        status: "active"
      });

    if (existingWorkout) {
      return res.status(400).json({
        success: false,
        message: "You have already started this workout"
      });
    }

    // Create user's workout
    const userWorkout =
      await UserWorkout.create({

        userId,

        workoutTemplateId,

        startDate,

        endDate,

        status: "active",

        notes
      });

    res.status(201).json({
      success: true,
      message: "Workout started successfully",
      userWorkout
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getMyWorkouts =
async(req,res)=>{

 try{

   const workouts =
   await UserWorkout
   .find({
      userId:req.user._id
   })
   .populate({
      path:
      "workoutTemplateId",

      populate:[
        {
          path:"goalGroupId"
        },
        {
          path:
          "days.exercises.exerciseId"
        }
      ]
   });

   res.status(200).json({

      success:true,

      workouts

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};

exports.getAssignments =
async(req,res)=>{

 try{

   const assignments =
   await UserWorkout
   .find()
   .populate("userId")
   .populate(
      "workoutTemplateId"
   )
   

   res.status(200).json({

      success:true,

      assignments

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};

exports.updateWorkoutStatus =
async(req,res)=>{

 try{

   const assignment =
   await UserWorkout
   .findByIdAndUpdate(

      req.params.id,

      req.body,

      {
        new:true
      }

   );

   if(!assignment){

      return res.status(404)
      .json({

         success:false,

         message:
         "Assignment not found"

      });

   }

   res.status(200).json({

      success:true,

      assignment

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};