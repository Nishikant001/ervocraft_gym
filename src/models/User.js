const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    mobile: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },
     branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    }, subscriptionPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
    },

    role: {
      type: String,
      enum: ["admin", "user", "trainer"],
      default: "user"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);