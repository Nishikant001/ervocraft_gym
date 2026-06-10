const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      unique: true
    },

    phone: {
      type: String,
      required: true
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },

    specialization: {
      type: String
    },

    experience: {
      type: Number,
      default: 0
    },

    profileImage: {
      type: String
    },

    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports =
mongoose.model(
  "Trainer",
  trainerSchema
);