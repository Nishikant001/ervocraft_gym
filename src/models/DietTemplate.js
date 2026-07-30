const mongoose =
require("mongoose");

const dietSchema =
new mongoose.Schema({

 goalGroupId:{
   type:
   mongoose.Schema.Types.ObjectId,
   ref:"GoalGroup"
 },

 title:String,

 meals:[
   {
      mealType:String,

      foods:[String]
   }
 ]

},{
 timestamps:true
});

module.exports =
mongoose.model(
"DietTemplate",
dietSchema
);