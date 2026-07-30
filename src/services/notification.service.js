const Notification =
require("../models/Notification");

const logger =
require("../utils/logger");

// Creates the in-app Notification document (existing
// model, already used by notification.controller.js).
// Accepts an optional Mongo session so it can be part of
// a larger transaction.
const createInAppNotification =
async({

  title,
  message,
  userId,
  branchId,
  targetType = "user",
  session

})=>{

  const docs =
  await Notification.create(
    [{
      title,
      message,
      targetType,
      userId,
      branchId
    }],
    session ? { session } : {}
  );

  return docs[0];

};

// Push notifications are a fire-and-forget external call,
// so this is intentionally NOT part of any Mongo
// transaction: it runs only after the DB transaction has
// committed, and its failure never rolls back DB writes.
//
// No push provider (FCM/OneSignal/etc.) is configured in
// this project yet, so this is wired up against a generic
// webhook URL (PUSH_WEBHOOK_URL) following the same
// "configure via env, no-op if unset" convention already
// used by mailer.js / cloudinary.js. Once a real provider
// is added, only the fetch call below needs to change.
const sendPushNotification =
async({

  userId,
  title,
  body,
  data = {}

})=>{

  const webhookUrl =
  process.env.PUSH_WEBHOOK_URL;

  if(!webhookUrl){

    logger.info({
      message:
      "Push notification skipped " +
      "(PUSH_WEBHOOK_URL not configured)",
      userId,
      title
    });

    return { sent:false };

  }

  try{

    const response =
    await fetch(webhookUrl,{

      method:"POST",

      headers:{
        "Content-Type":
        "application/json"
      },

      body:
      JSON.stringify({
        userId,
        title,
        body,
        data
      })

    });

    if(!response.ok){

      throw new Error(
        `Push webhook responded with ${response.status}`
      );

    }

    return { sent:true };

  }catch(error){

    logger.error({
      message:
      "Push notification failed",
      error:error.message,
      userId,
      title
    });

    return {
      sent:false,
      error:error.message
    };

  }

};

module.exports = {
  createInAppNotification,
  sendPushNotification
};
