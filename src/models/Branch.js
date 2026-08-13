const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: true,
      trim: true,
    },

    address: { 
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },
       totalUsers: {
      type: Number,
      default: 0,
    },

    totalTrainers: {
      type: Number,
      default: 0,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Branch",
  branchSchema
);