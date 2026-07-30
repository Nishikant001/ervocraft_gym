const Trainer =
require("../models/Trainer");

const UserSubscription =
require("../models/UserSubscription");

const UserDiet =
require("../models/UserDiet");

const UserFitnessProfile =
require("../models/UserFitnessProfile");

const GoalGroup =
require("../models/GoalGroup");

const DietTemplate =
require("../models/DietTemplate");

const User =
require("../models/User");

const logger =
require("../utils/logger");

// Picks the least-loaded active trainer in the member's
// branch (fewest currently-active memberships already
// assigned to them). Best-effort: returns null instead of
// throwing when no trainer can be picked, since a branch
// without trainers yet is a valid business state, not a
// system failure.
const assignTrainer =
async(branchId, session)=>{

  if(!branchId){
    return null;
  }

  const trainers =
  await Trainer.find({
    branchId,
    status:true
  }).session(session);

  if(!trainers.length){

    logger.info({
      message:
      "No active trainer available " +
      "for branch, skipping auto-assign",
      branchId
    });

    return null;

  }

  const trainerIds =
  trainers.map((t)=> t._id);

  const loadCounts =
  await UserSubscription.aggregate([

    {
      $match:{
        trainerId:{ $in:trainerIds },
        status:"active"
      }
    },

    {
      $group:{
        _id:"$trainerId",
        count:{ $sum:1 }
      }
    }

  ]).session(session);

  const countMap = new Map(
    loadCounts.map(
      (c)=> [String(c._id), c.count]
    )
  );

  let selected = trainers[0];

  let lowestCount =
  countMap.get(
    String(selected._id)
  ) || 0;

  for(const trainer of trainers){

    const count =
    countMap.get(
      String(trainer._id)
    ) || 0;

    if(count < lowestCount){
      selected = trainer;
      lowestCount = count;
    }

  }

  return selected;

};

// Best-effort resolution of the diet template to assign:
// 1. Match the member's fitness goal (if a fitness profile
//    already exists) to a GoalGroup by name.
// 2. Otherwise fall back to the earliest-created diet
//    template as a generic default.
// Returns null (no throw) if no template exists at all,
// e.g. on a fresh install with no templates seeded yet.
const pickDietTemplate =
async(userId, session)=>{

  const profile =
  await UserFitnessProfile
  .findOne({ userId })
  .session(session);

  if(profile && profile.fitnessGoal){

    const goalName =
    profile.fitnessGoal
    .replace(/_/g," ");

    const goalGroup =
    await GoalGroup.findOne({
      name:{
        $regex:goalName,
        $options:"i"
      }
    }).session(session);

    if(goalGroup){

      const matched =
      await DietTemplate.findOne({
        goalGroupId:goalGroup._id
      })
      .sort({ createdAt:-1 })
      .session(session);

      if(matched){
        return matched;
      }

    }

  }

  return DietTemplate
  .findOne({})
  .sort({ createdAt:1 })
  .session(session);

};

// Creates a UserDiet assignment for the newly paid member.
// `assignedBy` must be a User (schema requirement of
// UserDiet), so we attribute automatic assignments to an
// admin account (the seeded admin, or the first admin
// found) representing the system. Returns null instead of
// throwing when nothing can be assigned, matching
// assignTrainer's best-effort behaviour.
const assignDiet =
async({ userId, startDate, endDate, session })=>{

  const template =
  await pickDietTemplate(
    userId,
    session
  );

  if(!template){

    logger.info({
      message:
      "No diet template available, " +
      "skipping auto diet assignment",
      userId
    });

    return null;

  }

  const assigner =
  await User.findOne({
    role:"admin"
  }).session(session);

  if(!assigner){

    logger.info({
      message:
      "No admin user found to attribute " +
      "auto diet assignment to, skipping",
      userId
    });

    return null;

  }

  const docs =
  await UserDiet.create(
    [{
      userId,
      dietTemplateId:template._id,
      assignedBy:assigner._id,
      startDate,
      endDate,
      status:"active",
      notes:
      "Auto-assigned on membership " +
      "activation"
    }],
    { session }
  );

  return docs[0];

};

module.exports = {
  assignTrainer,
  assignDiet
};
