const mongoose =
require("mongoose");

const DietProgress =
require("../models/DietProgress");

const User =
require("../models/User");

const dietProgressService =
require("../services/dietProgress.service");

const STAFF_ROLES = [
  "admin",
  "trainer"
];

const isValidId =
(id)=>{

 return (
   mongoose.Types.ObjectId
   .isValid(id)
 );

};

// Staff (admin/trainer) can access any user's data,
// a normal user can only access their own.
const canAccessUser =
(req,targetUserId)=>{

 if(
   STAFF_ROLES.includes(
     req.user.role
   )
 ){
   return true;
 }

 return (
   String(req.user._id) ===
   String(targetUserId)
 );

};

const parsePagination =
(req)=>{

 let page =
 parseInt(req.query.page,10);

 let limit =
 parseInt(req.query.limit,10);

 if(!Number.isInteger(page) || page < 1){
   page = 1;
 }

 if(
   !Number.isInteger(limit) ||
   limit < 1
 ){
   limit = 10;
 }

 if(limit > 100){
   limit = 100;
 }

 return {
   page,
   limit,
   skip:(page - 1) * limit
 };

};

const parseSort =
(req)=>{

 const allowedSortFields = [
   "createdAt",
   "date",
   "currentWeight",
   "progressPercent",
   "mealCompletionPercent",
   "workoutCompletionPercent"
 ];

 let sortBy =
 req.query.sortBy;

 if(!allowedSortFields.includes(sortBy)){
   sortBy = "createdAt";
 }

 const order =
 req.query.order === "asc" ?
 1 : -1;

 return {
   [sortBy]:order
 };

};

// Shared filter builder for the listing endpoints.
const buildFilter =
(req,userId)=>{

 const filter = {
   userId
 };

 if(
   req.query.status &&
   [
     "active",
     "completed",
     "paused",
     "cancelled"
   ].includes(req.query.status)
 ){
   filter.status = req.query.status;
 }

 if(
   req.query.userDietId &&
   isValidId(req.query.userDietId)
 ){
   filter.userDietId =
   req.query.userDietId;
 }

 if(
   req.query.dietTemplateId &&
   isValidId(req.query.dietTemplateId)
 ){
   filter.dietTemplateId =
   req.query.dietTemplateId;
 }

 if(
   req.query.goalGroupId &&
   isValidId(req.query.goalGroupId)
 ){
   filter.goalGroupId =
   req.query.goalGroupId;
 }

 if(
   req.query.startDate ||
   req.query.endDate
 ){

   filter.createdAt = {};

   if(req.query.startDate){

     const start =
     new Date(req.query.startDate);

     if(!isNaN(start)){
       filter.createdAt.$gte = start;
     }

   }

   if(req.query.endDate){

     const end =
     new Date(req.query.endDate);

     if(!isNaN(end)){
       filter.createdAt.$lte = end;
     }

   }

   if(
     Object.keys(filter.createdAt)
     .length === 0
   ){
     delete filter.createdAt;
   }

 }

 if(
   req.query.search &&
   String(req.query.search).trim()
 ){

   filter.notes = {
     $regex:
     String(req.query.search).trim(),
     $options:"i"
   };

 }

 return filter;

};

// CREATE
exports.createProgress =
async(req,res)=>{

 try{

   const {
     userId,
     currentWeight
   } = req.body;

   if(!userId || !isValidId(userId)){

     return res.status(400)
     .json({
       success:false,
       message:"Valid userId is required"
     });

   }

   if(
     typeof currentWeight !== "number"
   ){

     return res.status(400)
     .json({
       success:false,
       message:"currentWeight is required"
     });

   }

   if(!canAccessUser(req,userId)){

     return res.status(403)
     .json({
       success:false,
       message:"Permission denied"
     });

   }

   const targetUser =
   await User.findById(userId);

   if(!targetUser){

     return res.status(404)
     .json({
       success:false,
       message:"User not found"
     });

   }

   const autoFields =
   await dietProgressService
   .buildAutoCalculatedFields(
     DietProgress,
     userId,
     req.body
   );

   const progress =
   await DietProgress.create({

     userId,

     assignedBy:
     STAFF_ROLES.includes(req.user.role) ?
     req.user._id :
     undefined,

     userDietId:
     req.body.userDietId,

     dietTemplateId:
     req.body.dietTemplateId,

     goalGroupId:
     req.body.goalGroupId,

     currentWeight,

     targetWeight:
     req.body.targetWeight,

     bodyFatPercent:
     req.body.bodyFatPercent,

     muscleMass:
     req.body.muscleMass,

     caloriesTarget:
     req.body.caloriesTarget,

     proteinTarget:
     req.body.proteinTarget,

     carbsTarget:
     req.body.carbsTarget,

     fatTarget:
     req.body.fatTarget,

     caloriesConsumed:
     req.body.caloriesConsumed,

     waterIntake:
     req.body.waterIntake,

     breakfastCompleted:
     req.body.breakfastCompleted,

     lunchCompleted:
     req.body.lunchCompleted,

     dinnerCompleted:
     req.body.dinnerCompleted,

     snacksCompleted:
     req.body.snacksCompleted,

     workoutCompletionPercent:
     req.body.workoutCompletionPercent,

     measurements:
     req.body.measurements,

     photos:
     req.body.photos,

     status:
     req.body.status,

     notes:
     req.body.notes,

     date:
     req.body.date,

     ...autoFields

   });

   res.status(201).json({

     success:true,

     message:"Diet progress created successfully",

     progress

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};

// UPDATE
exports.updateProgress =
async(req,res)=>{

 try{

   const {
     id
   } = req.params;

   if(!isValidId(id)){

     return res.status(400)
     .json({
       success:false,
       message:"Invalid progress id"
     });

   }

   const existing =
   await DietProgress.findById(id);

   if(!existing){

     return res.status(404)
     .json({
       success:false,
       message:"Diet progress not found"
     });

   }

   if(!canAccessUser(req,existing.userId)){

     return res.status(403)
     .json({
       success:false,
       message:"Permission denied"
     });

   }

   const mergedPayload = {

     startingWeight:
     req.body.startingWeight !== undefined ?
     req.body.startingWeight :
     existing.startingWeight,

     currentWeight:
     req.body.currentWeight !== undefined ?
     req.body.currentWeight :
     existing.currentWeight,

     targetWeight:
     req.body.targetWeight !== undefined ?
     req.body.targetWeight :
     existing.targetWeight,

     height:
     req.body.height !== undefined ?
     req.body.height :
     existing.height,

     userDietId:
     req.body.userDietId !== undefined ?
     req.body.userDietId :
     existing.userDietId,

     breakfastCompleted:
     req.body.breakfastCompleted !== undefined ?
     req.body.breakfastCompleted :
     existing.breakfastCompleted,

     lunchCompleted:
     req.body.lunchCompleted !== undefined ?
     req.body.lunchCompleted :
     existing.lunchCompleted,

     dinnerCompleted:
     req.body.dinnerCompleted !== undefined ?
     req.body.dinnerCompleted :
     existing.dinnerCompleted,

     snacksCompleted:
     req.body.snacksCompleted !== undefined ?
     req.body.snacksCompleted :
     existing.snacksCompleted

   };

   const autoFields =
   await dietProgressService
   .buildAutoCalculatedFields(
     DietProgress,
     existing.userId,
     mergedPayload
   );

   const updatePayload = {
     ...req.body,
     ...autoFields
   };

   // userId must never change via update
   delete updatePayload.userId;

   if(
     STAFF_ROLES.includes(req.user.role)
   ){
     updatePayload.assignedBy =
     req.user._id;
   }

   const progress =
   await DietProgress
   .findByIdAndUpdate(
     id,
     updatePayload,
     {
       new:true,
       runValidators:true
     }
   );

   res.status(200).json({

     success:true,

     message:"Diet progress updated successfully",

     progress

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};

// DELETE
exports.deleteProgress =
async(req,res)=>{

 try{

   const {
     id
   } = req.params;

   if(!isValidId(id)){

     return res.status(400)
     .json({
       success:false,
       message:"Invalid progress id"
     });

   }

   const existing =
   await DietProgress.findById(id);

   if(!existing){

     return res.status(404)
     .json({
       success:false,
       message:"Diet progress not found"
     });

   }

   if(!canAccessUser(req,existing.userId)){

     return res.status(403)
     .json({
       success:false,
       message:"Permission denied"
     });

   }

   await DietProgress
   .findByIdAndDelete(id);

   res.status(200).json({

     success:true,

     message:"Diet progress deleted successfully"

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};

// GET MY PROGRESS (logged in user)
exports.getMyProgress =
async(req,res)=>{

 try{

   const {
     page,
     limit,
     skip
   } = parsePagination(req);

   const sort =
   parseSort(req);

   const filter =
   buildFilter(req,req.user._id);

   const [
     records,
     total
   ] = await Promise.all([

     DietProgress
     .find(filter)
     .sort(sort)
     .skip(skip)
     .limit(limit)
     .populate("dietTemplateId")
     .populate("goalGroupId"),

     DietProgress
     .countDocuments(filter)

   ]);

   res.status(200).json({

     success:true,

     records,

     pagination:{
       total,
       page,
       limit,
       totalPages:
       Math.ceil(total / limit) || 1
     }

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};

// GET USER PROGRESS (admin/trainer)
exports.getUserProgress =
async(req,res)=>{

 try{

   const {
     userId
   } = req.params;

   if(!isValidId(userId)){

     return res.status(400)
     .json({
       success:false,
       message:"Invalid userId"
     });

   }

   const user =
   await User.findById(userId);

   if(!user){

     return res.status(404)
     .json({
       success:false,
       message:"User not found"
     });

   }

   const {
     page,
     limit,
     skip
   } = parsePagination(req);

   const sort =
   parseSort(req);

   const filter =
   buildFilter(req,userId);

   const [
     records,
     total
   ] = await Promise.all([

     DietProgress
     .find(filter)
     .sort(sort)
     .skip(skip)
     .limit(limit)
     .populate("userId")
     .populate("assignedBy")
     .populate("dietTemplateId")
     .populate("goalGroupId"),

     DietProgress
     .countDocuments(filter)

   ]);

   res.status(200).json({

     success:true,

     records,

     pagination:{
       total,
       page,
       limit,
       totalPages:
       Math.ceil(total / limit) || 1
     }

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};

const resolveTargetUserId =
(req)=>{

 if(
   req.query.userId &&
   STAFF_ROLES.includes(req.user.role)
 ){
   return req.query.userId;
 }

 return req.user._id;

};

// GET WEEKLY PROGRESS
exports.getWeeklyProgress =
async(req,res)=>{

 try{

   const targetUserId =
   resolveTargetUserId(req);

   if(!isValidId(targetUserId)){

     return res.status(400)
     .json({
       success:false,
       message:"Invalid userId"
     });

   }

   if(!canAccessUser(req,targetUserId)){

     return res.status(403)
     .json({
       success:false,
       message:"Permission denied"
     });

   }

   const since =
   new Date();

   since.setDate(
     since.getDate() - 7
   );

   const entries =
   await DietProgress
   .find({
     userId:targetUserId,
     createdAt:{
       $gte:since
     }
   })
   .sort({
     createdAt:1
   });

   const weeklyProgress =
   await dietProgressService
   .calculatePeriodProgress(
     DietProgress,
     targetUserId,
     7
   );

   res.status(200).json({

     success:true,

     weeklyProgress,

     entries

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};

// GET MONTHLY PROGRESS
exports.getMonthlyProgress =
async(req,res)=>{

 try{

   const targetUserId =
   resolveTargetUserId(req);

   if(!isValidId(targetUserId)){

     return res.status(400)
     .json({
       success:false,
       message:"Invalid userId"
     });

   }

   if(!canAccessUser(req,targetUserId)){

     return res.status(403)
     .json({
       success:false,
       message:"Permission denied"
     });

   }

   const since =
   new Date();

   since.setDate(
     since.getDate() - 30
   );

   const entries =
   await DietProgress
   .find({
     userId:targetUserId,
     createdAt:{
       $gte:since
     }
   })
   .sort({
     createdAt:1
   });

   const monthlyProgress =
   await dietProgressService
   .calculatePeriodProgress(
     DietProgress,
     targetUserId,
     30
   );

   res.status(200).json({

     success:true,

     monthlyProgress,

     entries

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};

const GRAPH_METRICS = {

 weight:"currentWeight",
 bmi:"bmi",
 bodyFat:"bodyFatPercent",
 muscleMass:"muscleMass",
 calories:"caloriesConsumed",
 waterIntake:"waterIntake",
 mealCompletion:"mealCompletionPercent",
 workoutCompletion:"workoutCompletionPercent"

};

// GET GRAPH DATA
exports.getGraphData =
async(req,res)=>{

 try{

   const targetUserId =
   resolveTargetUserId(req);

   if(!isValidId(targetUserId)){

     return res.status(400)
     .json({
       success:false,
       message:"Invalid userId"
     });

   }

   if(!canAccessUser(req,targetUserId)){

     return res.status(403)
     .json({
       success:false,
       message:"Permission denied"
     });

   }

   const metricKey =
   GRAPH_METRICS[req.query.metric] ?
   req.query.metric :
   "weight";

   const field =
   GRAPH_METRICS[metricKey];

   let days =
   parseInt(req.query.days,10);

   if(!Number.isInteger(days) || days < 1){
     days = 30;
   }

   const since =
   new Date();

   since.setDate(
     since.getDate() - days
   );

   const records =
   await DietProgress
   .find({
     userId:targetUserId,
     createdAt:{
       $gte:since
     }
   })
   .sort({
     createdAt:1
   })
   .select(`${field} createdAt`);

   const graphData =
   records.map(
     (record)=>({
       date:record.createdAt,
       value:record[field] ?? null
     })
   );

   res.status(200).json({

     success:true,

     metric:metricKey,

     days,

     graphData

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};

// GET DASHBOARD SUMMARY
exports.getDashboardSummary =
async(req,res)=>{

 try{

   const targetUserId =
   resolveTargetUserId(req);

   if(!isValidId(targetUserId)){

     return res.status(400)
     .json({
       success:false,
       message:"Invalid userId"
     });

   }

   if(!canAccessUser(req,targetUserId)){

     return res.status(403)
     .json({
       success:false,
       message:"Permission denied"
     });

   }

   const [
     latest,
     totalEntries,
     averages
   ] = await Promise.all([

     DietProgress
     .findOne({
       userId:targetUserId
     })
     .sort({
       createdAt:-1
     })
     .populate("dietTemplateId")
     .populate("goalGroupId"),

     DietProgress
     .countDocuments({
       userId:targetUserId
     }),

     DietProgress.aggregate([

       {
         $match:{
           userId:
           new mongoose.Types.ObjectId(
             targetUserId
           )
         }
       },

       {
         $group:{

           _id:null,

           avgMealCompletion:{
             $avg:"$mealCompletionPercent"
           },

           avgWorkoutCompletion:{
             $avg:"$workoutCompletionPercent"
           },

           avgCaloriesConsumed:{
             $avg:"$caloriesConsumed"
           }

         }
       }

     ])

   ]);

   if(!latest){

     return res.status(200).json({

       success:true,

       summary:null,

       message:"No diet progress records found"

     });

   }

   const summary = {

     userId:targetUserId,

     status:latest.status,

     startingWeight:latest.startingWeight,

     currentWeight:latest.currentWeight,

     targetWeight:latest.targetWeight,

     weightDifference:latest.weightDifference,

     goalRemaining:latest.goalRemaining,

     progressPercent:latest.progressPercent,

     bmi:latest.bmi,

     bodyFatPercent:latest.bodyFatPercent,

     muscleMass:latest.muscleMass,

     mealCompletionPercent:latest.mealCompletionPercent,

     workoutCompletionPercent:latest.workoutCompletionPercent,

     weeklyProgress:latest.weeklyProgress,

     monthlyProgress:latest.monthlyProgress,

     totalEntries,

     avgMealCompletion:
     averages[0] ?
     dietProgressService.round2(
       averages[0].avgMealCompletion || 0
     ) : 0,

     avgWorkoutCompletion:
     averages[0] ?
     dietProgressService.round2(
       averages[0].avgWorkoutCompletion || 0
     ) : 0,

     avgCaloriesConsumed:
     averages[0] ?
     dietProgressService.round2(
       averages[0].avgCaloriesConsumed || 0
     ) : 0,

     lastUpdated:latest.updatedAt,

     dietTemplate:latest.dietTemplateId,

     goalGroup:latest.goalGroupId

   };

   res.status(200).json({

     success:true,

     summary

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};
