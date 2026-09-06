const mongoose = require("mongoose");

const paymentSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      draftId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "RegistrationDraft",
      },

      subscriptionPlanId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
      },

      orderId: String,

      productOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },

      orderType: {
        type: String,
        enum: ["subscription", "product"],
        default: "subscription",
      },

      razorpaySignature: String,

      paymentId: String,

      amount: Number,

      status: {
        type: String,
        enum: [
          "created",
          "success",
          "failed",
        ],
        default: "created",
      },

      paymentMethod: {
        type: String,
        default: "razorpay",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Payment",
    paymentSchema
  );