const mongoose = require("mongoose");

const subscriptionPlanSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      durationDays: {
        type: Number,
        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      description: {
        type: String,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema
);