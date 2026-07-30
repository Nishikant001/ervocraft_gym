const mongoose = require("mongoose");

const userSubscriptionSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      subscriptionPlanId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        required: true,
      },

      // Auto-assigned during the post-payment workflow
      // (see paymentWorkflow.service.js). Optional so this
      // stays backward compatible with existing records.
      trainerId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
      },

      dietId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "UserDiet",
      },

      startDate: {
        type: Date,
        required: true,
      },

      endDate: {
        type: Date,
        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "active",
          "expired",
          "cancelled",
        ],
        default: "active",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "UserSubscription",
    userSubscriptionSchema
  );