const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Branch = require("../models/Branch");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const RegistrationDraft = require("../models/RegistrationDraft");

const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");

exports.registerStepOne = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      password,
      confirmPassword,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !mobile ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const existingDraft =
      await RegistrationDraft.findOne({
        $or: [{ email }, { mobile }],
      });

    if (existingDraft) {
      await RegistrationDraft.deleteOne({
        _id: existingDraft._id,
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const draft =
      await RegistrationDraft.create({
        fullName,
        email,
        mobile,
        password: hashedPassword,
        currentStep: 1,
      });

    return res.status(201).json({
      success: true,
      draftId: draft._id,
      currentStep: draft.currentStep,
      message:
        "Step 1 completed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.registerStepTwo = async (req, res) => {
  try {
    const { draftId, branchId } = req.body;

    const draft =
      await RegistrationDraft.findById(
        draftId
      );

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: "Draft not found",
      });
    }

    draft.branchId = branchId;
    draft.currentStep = 2;

    await draft.save();

    return res.status(200).json({
      success: true,
      currentStep: draft.currentStep,
      draft,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.registerStepThree = async (
  req,
  res
) => {
  try {
    const {
      draftId,
      subscriptionPlanId,
    } = req.body;

    const draft =
      await RegistrationDraft.findById(
        draftId
      );

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: "Draft not found",
      });
    }

    draft.subscriptionPlanId =
      subscriptionPlanId;

    draft.currentStep = 3;

    await draft.save();

    return res.status(200).json({
      success: true,
      currentStep: draft.currentStep,
      draft,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.completeRegistration =
  async (req, res) => {
    try {
      const { draftId } =
        req.body;

      const draft =
        await RegistrationDraft.findById(
          draftId
        );

      if (!draft) {
        return res.status(404).json({
          success: false,
          message:
            "Draft not found",
        });
      }

      if (
        !draft.branchId ||
        !draft.subscriptionPlanId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Registration steps incomplete",
        });
      }

      const existingUser =
        await User.findOne({
          $or: [
            {
              email: draft.email,
            },
            {
              mobile:
                draft.mobile,
            },
          ],
        });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            "User already exists",
        });
      }

      const user =
        await User.create({
          fullName:
            draft.fullName,
          email: draft.email,
          mobile:
            draft.mobile,
          password:
            draft.password,
          branchId:
            draft.branchId,
          subscriptionPlanId:
            draft.subscriptionPlanId,
        });

        await Branch.findByIdAndUpdate(
  draft.branchId,
  {
    $inc: {
      totalUsers: 1,
    },
  }
);

      const accessToken =
        generateAccessToken(
          user._id
        );

      const refreshToken =
        generateRefreshToken(
          user._id
        );

      await RefreshToken.create({
        user: user._id,
        token:
          refreshToken,
      });

      await RegistrationDraft.findByIdAndDelete(
        draftId
      );

      return res.status(201).json({
        success: true,
        accessToken,
        refreshToken,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  exports.login = async (
  req,
  res
) => {
  try {
    const { email, password } =
      req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password required",
      });
    }

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const accessToken =
      generateAccessToken(
        user._id
      );

    const refreshToken =
      generateRefreshToken(
        user._id
      );

    await RefreshToken.create({
      user: user._id,
      token:
        refreshToken,
    });

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.refreshToken =
  async (req, res) => {
    try {
      const { refreshToken } =
        req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message:
            "Refresh token required",
        });
      }

      const storedToken =
        await RefreshToken.findOne({
          token:
            refreshToken,
        });

      if (!storedToken) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid refresh token",
        });
      }

      const decoded =
        jwt.verify(
          refreshToken,
          process.env
            .REFRESH_TOKEN_SECRET
        );

      const accessToken =
        generateAccessToken(
          decoded.userId
        );

      return res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message:
          "Refresh token expired",
      });
    }
  };

  exports.logout = async (
  req,
  res
) => {
  try {
    const { refreshToken } =
      req.body;

    await RefreshToken.deleteOne({
      token: refreshToken,
    });

    return res.status(200).json({
      success: true,
      message:
        "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProfile =
  async (req, res) => {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  };


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const oldUser = await User.findById(userId);

    if (!oldUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      req.body.branchId &&
      oldUser.branchId.toString() !== req.body.branchId
    ) {
      // Old branch
      await Branch.findByIdAndUpdate(
        oldUser.branchId,
        {
          $inc: {
            totalUsers: -1,
          },
        }
      );

      // New branch
      await Branch.findByIdAndUpdate(
        req.body.branchId,
        {
          $inc: {
            totalUsers: 1,
          },
        }
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};