const mongoose = require("mongoose");

const registrationDraftSchema =
  new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      mobile: {
        type: String,
        required: true,
      },

      password: {
        type: String,
        required: true,
      },

      branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
      },

      subscriptionPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
      },

      currentStep: {
        type: Number,
        default: 1,
      },

      paymentCompleted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "RegistrationDraft",
  registrationDraftSchema
);