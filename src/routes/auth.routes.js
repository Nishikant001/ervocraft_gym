const express = require("express");

const router = express.Router();

const {
  registerStepOne,
  registerStepTwo,
  registerStepThree,
  completeRegistration,
  login,
  refreshToken,
  logout,
  getProfile,
} = require("../controllers/auth.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

router.post(
  "/register-step-1",
  registerStepOne
);

router.post(
  "/register-step-2",
  registerStepTwo
);

router.post(
  "/register-step-3",
  registerStepThree
);

router.post(
  "/complete-registration",
  completeRegistration
);

router.post(
  "/login",
  login
);

router.post(
  "/refresh-token",
  refreshToken
);

router.post(
  "/logout",
  logout
);

router.get(
  "/profile",
  protect,
  getProfile
);

module.exports = router;