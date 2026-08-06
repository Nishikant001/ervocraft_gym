const Joi =
require("joi");

const photoSchema =
Joi.object({

 type:
 Joi.string()
 .valid("before","after")
 .required(),

 url:
 Joi.string()
 .uri()
 .required(),

 note:
 Joi.string()
 .allow("",null),

 date:
 Joi.date()

});

exports.createDietProgressSchema =
Joi.object({

 userId:
 Joi.string()
 .required(),

 userDietId:
 Joi.string(),

 dietTemplateId:
 Joi.string(),

 goalGroupId:
 Joi.string(),

 startingWeight:
 Joi.number()
 .min(0),

 currentWeight:
 Joi.number()
 .min(0)
 .required(),

 targetWeight:
 Joi.number()
 .min(0),

 height:
 Joi.number()
 .min(0),

 caloriesTarget:
 Joi.number()
 .min(0),

 proteinTarget:
 Joi.number()
 .min(0),

 carbsTarget:
 Joi.number()
 .min(0),

 fatTarget:
 Joi.number()
 .min(0),

 caloriesConsumed:
 Joi.number()
 .min(0),

 waterIntake:
 Joi.number()
 .min(0),

 breakfastCompleted:
 Joi.boolean(),

 lunchCompleted:
 Joi.boolean(),

 dinnerCompleted:
 Joi.boolean(),

 workoutCompletionPercent:
 Joi.number()
 .min(0)
 .max(100),

 photos:
 Joi.array()
 .items(photoSchema),

 status:
 Joi.string()
 .valid(
   "active",
   "completed",
   "paused",
   "cancelled"
 ),

 notes:
 Joi.string()
 .allow("",null),

 date:
 Joi.date()

});

exports.updateDietProgressSchema =
Joi.object({

 userDietId:
 Joi.string(),

 dietTemplateId:
 Joi.string(),

 goalGroupId:
 Joi.string(),

 startingWeight:
 Joi.number()
 .min(0),

 currentWeight:
 Joi.number()
 .min(0),

 targetWeight:
 Joi.number()
 .min(0),

 height:
 Joi.number()
 .min(0),

 caloriesTarget:
 Joi.number()
 .min(0),

 proteinTarget:
 Joi.number()
 .min(0),

 carbsTarget:
 Joi.number()
 .min(0),

 fatTarget:
 Joi.number()
 .min(0),

 caloriesConsumed:
 Joi.number()
 .min(0),

 waterIntake:
 Joi.number()
 .min(0),

 breakfastCompleted:
 Joi.boolean(),

 lunchCompleted:
 Joi.boolean(),

 dinnerCompleted:
 Joi.boolean(),

 workoutCompletionPercent:
 Joi.number()
 .min(0)
 .max(100),

 photos:
 Joi.array()
 .items(photoSchema),

 status:
 Joi.string()
 .valid(
   "active",
   "completed",
   "paused",
   "cancelled"
 ),

 notes:
 Joi.string()
 .allow("",null),

 date:
 Joi.date()

}).min(1);
