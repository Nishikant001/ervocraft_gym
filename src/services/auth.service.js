const bcrypt = require("bcryptjs");

const User = require("../models/User");

const registerUser = async (
  payload
) => {
  const {
    fullName,
    email,
    mobile,
    password
  } = payload;

  const existingUser =
    await User.findOne({
      $or: [
        { email },
        { mobile }
      ]
    });

  if (existingUser) {
    throw new Error(
      "User already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );

  return await User.create({
    fullName,
    email,
    mobile,
    password: hashedPassword
  });
};

module.exports = {
  registerUser
};