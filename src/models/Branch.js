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