const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,

        message: "User not found",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,

        message: "Account disabled",
      });
    }

    req.user = user;

    req.gymId = user.gymId || null;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid access token",
    });
  }
};
