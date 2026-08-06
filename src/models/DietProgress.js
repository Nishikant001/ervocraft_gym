const mongoose =
require("mongoose");

const progressPhotoSchema =
new mongoose.Schema({

  type:{
    type:String,
    enum:[
      "before",
      "after"
    ],
    required:true
  },

  url:{
    type:String,
    required:true
  },

  note:String,

  date:{
    type:Date,
    default:Date.now
  }

},{
  _id:false
});

const dietProgressSchema =
new mongoose.Schema({

  // Core relations
  userId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  assignedBy:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  userDietId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"UserDiet"
  },

  dietTemplateId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"DietTemplate"
  },

  goalGroupId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"GoalGroup"
  },

  // Weight tracking
  startingWeight:Number,

  currentWeight:Number,

  targetWeight:Number,

  height:Number,

  // Nutrition targets
  caloriesTarget:Number,

  proteinTarget:Number,

  carbsTarget:Number,

  fatTarget:Number,

  caloriesConsumed:Number,

  waterIntake:Number,

  // Meal completion (kept for backward compatibility
  // with existing userDiet.controller.js usage)
  breakfastCompleted:{
    type:Boolean,
    default:false
  },

  lunchCompleted:{
    type:Boolean,
    default:false
  },

  dinnerCompleted:{
    type:Boolean,
    default:false
  },

  mealCompletionPercent:{
    type:Number,
    default:0,
    min:0,
    max:100
  },

  workoutCompletionPercent:{
    type:Number,
    default:0,
    min:0,
    max:100
  },

  // Auto-calculated progress fields
  weightDifference:Number,

  goalRemaining:Number,

  progressPercent:{
    type:Number,
    min:0,
    max:100
  },

  weeklyProgress:Number,

  monthlyProgress:Number,

  // Media
  photos:[progressPhotoSchema],

  status:{
    type:String,
    enum:[
      "active",
      "completed",
      "paused",
      "cancelled"
    ],
    default:"active"
  },

  notes:String,

  date:{
    type:Date,
    default:Date.now
  }

},{
  timestamps:true
});

// Indexes for fast lookups, filtering and sorting
dietProgressSchema.index({
  userId:1,
  date:-1
});

dietProgressSchema.index({
  userId:1,
  createdAt:-1
});

dietProgressSchema.index({
  userDietId:1
});

dietProgressSchema.index({
  assignedBy:1
});

dietProgressSchema.index({
  status:1
});

dietProgressSchema.index({
  goalGroupId:1
});

module.exports =
mongoose.model(
"DietProgress",
dietProgressSchema
);
