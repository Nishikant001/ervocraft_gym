const round2 =
(num)=>{

 return Math.round(
   (num + Number.EPSILON) * 100
 ) / 100;

};

const getBaselineEntry =
async(DietProgress,userId,userDietId)=>{

 const query = {
   userId
 };

 if(userDietId){
   query.userDietId = userDietId;
 }

 return DietProgress
 .findOne(query)
 .sort({
   createdAt:1
 });

};

const calculateMealCompletion =
(payload)=>{

 const meals = [
   payload.breakfastCompleted,
   payload.lunchCompleted,
   payload.dinnerCompleted
 ];

 const tracked =
 meals.filter(
   (m)=> typeof m === "boolean"
 );

 if(tracked.length === 0){
   return null;
 }

 const completed =
 tracked.filter(Boolean).length;

 return round2(
   (completed / tracked.length) * 100
 );

};

const calculateWeightMetrics =
({startingWeight,currentWeight,targetWeight})=>{

 const result = {
   weightDifference:null,
   goalRemaining:null,
   progressPercent:null
 };

 if(
   typeof currentWeight === "number" &&
   typeof startingWeight === "number"
 ){
   result.weightDifference =
   round2(
     currentWeight - startingWeight
   );
 }

 if(
   typeof currentWeight === "number" &&
   typeof targetWeight === "number"
 ){
   result.goalRemaining =
   round2(
     currentWeight - targetWeight
   );
 }

 if(
   typeof startingWeight === "number" &&
   typeof targetWeight === "number" &&
   typeof currentWeight === "number"
 ){

   const totalChange =
   startingWeight - targetWeight;

   const achievedChange =
   startingWeight - currentWeight;

   if(totalChange !== 0){

     let percent =
     (achievedChange / totalChange) * 100;

     percent =
     Math.max(
       0,
       Math.min(100,percent)
     );

     result.progressPercent =
     round2(percent);

   }else{

     result.progressPercent = 100;

   }

 }

 return result;

};

// Net weight change across the last N days, used for
// weeklyProgress / monthlyProgress snapshots.
const calculatePeriodProgress =
async(DietProgress,userId,days)=>{

 const since =
 new Date();

 since.setDate(
   since.getDate() - days
 );

 const entries =
 await DietProgress
 .find({
   userId,
   createdAt:{
     $gte:since
   },
   currentWeight:{
     $ne:null
   }
 })
 .sort({
   createdAt:1
 })
 .select("currentWeight createdAt");

 if(entries.length < 2){
   return null;
 }

 const first =
 entries[0].currentWeight;

 const last =
 entries[entries.length - 1]
 .currentWeight;

 if(
   typeof first !== "number" ||
   typeof last !== "number"
 ){
   return null;
 }

 return round2(last - first);

};

// Builds every auto-calculated field for a create/update
// payload. DietProgress model is passed in to avoid a
// circular require between the model and this service.
const buildAutoCalculatedFields =
async(DietProgress,userId,payload)=>{

 const computed = {};

 let startingWeight =
 payload.startingWeight;

 if(typeof startingWeight !== "number"){

   const baseline =
   await getBaselineEntry(
     DietProgress,
     userId,
     payload.userDietId
   );

   if(
     baseline &&
     typeof baseline.startingWeight === "number"
   ){
     startingWeight =
     baseline.startingWeight;
   }else if(
     typeof payload.currentWeight === "number"
   ){
     startingWeight =
     payload.currentWeight;
   }

 }

 if(typeof startingWeight === "number"){
   computed.startingWeight = startingWeight;
 }

 Object.assign(
   computed,
   calculateWeightMetrics({
     startingWeight,
     currentWeight:payload.currentWeight,
     targetWeight:payload.targetWeight
   })
 );

 if(
   typeof payload.currentWeight === "number" &&
   typeof payload.height === "number"
 ){
   computed.height = payload.height;
 }

 const mealCompletionPercent =
 calculateMealCompletion(payload);

 if(mealCompletionPercent !== null){
   computed.mealCompletionPercent =
   mealCompletionPercent;
 }

 const weeklyProgress =
 await calculatePeriodProgress(
   DietProgress,
   userId,
   7
 );

 if(weeklyProgress !== null){
   computed.weeklyProgress = weeklyProgress;
 }

 const monthlyProgress =
 await calculatePeriodProgress(
   DietProgress,
   userId,
   30
 );

 if(monthlyProgress !== null){
   computed.monthlyProgress = monthlyProgress;
 }

 return computed;

};

module.exports = {
  round2,
  getBaselineEntry,
  calculateMealCompletion,
  calculateWeightMetrics,
  calculatePeriodProgress,
  buildAutoCalculatedFields
};
