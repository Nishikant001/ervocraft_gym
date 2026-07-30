const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin =
      await User.findOne({
        email: "admin@gym.com",
      });

    if (existingAdmin) {
      console.log(
        "Admin already exists"
      );

      process.exit();
    }

    const hashedPassword =
      await bcrypt.hash(
        "Admin@123",
        10
      );

    await User.create({
      fullName:
        "Super Admin",

      email:
        "admin@gym.com",

      mobile:
        "9999999999",

      password:
        hashedPassword,

      role: "admin",

      isActive: true,
    });

    console.log(
      "Admin created successfully"
    );

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

seedAdmin();