// const mongoose =
// require("mongoose");

// const userWorkoutSchema =
// new mongoose.Schema({

//   userId:{
//     type:
//     mongoose.Schema.Types.ObjectId,
//     ref:"User",
//     required:true
//   },

//   workoutTemplateId:{
//     type:
//     mongoose.Schema.Types.ObjectId,
//     ref:"WorkoutTemplate",
//     required:true
//   },

//   assignedBy:{
//     type:
//     mongoose.Schema.Types.ObjectId,
//     ref:"User",
//     required:true
//   },

//   startDate:{
//     type:Date,
//     required:true
//   },

//   endDate:{
//     type:Date,
//     required:true
//   },

//   status:{
//     type:String,
//     enum:[
//       "assigned",
//       "active",
//       "completed",
//       "expired"
//     ],
//     default:"assigned"
//   },

//   notes:String

// },{
//  timestamps:true
// });

// module.exports =
// mongoose.model(
// "UserWorkout",
// userWorkoutSchema
// );


const mongoose =
require("mongoose");


const userWorkoutSchema =
new mongoose.Schema({

  // USER WHO STARTED THE WORKOUT
  userId: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },


  // WORKOUT TEMPLATE SELECTED BY USER
  workoutTemplateId: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "WorkoutTemplate",
    required: true
  },


  // WORKOUT START DATE
  startDate: {
    type: Date,
    required: true
  },


  // WORKOUT END DATE
  endDate: {
    type: Date,
    required: true
  },


  // CURRENT WORKOUT STATUS
  status: {
    type: String,
    enum: [
      "active",
      "completed",
      "expired"
    ],
    default: "active"
  },


  // OPTIONAL NOTES
  notes: String

}, {
  timestamps: true
});


module.exports =
mongoose.model(
  "UserWorkout",
  userWorkoutSchema
);