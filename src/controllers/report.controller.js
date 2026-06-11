const Payment =
require("../models/Payment");

const User =
require("../models/User");

const Branch =
require("../models/Branch");

const UserSubscription =
require("../models/UserSubscription");

// REVENUE REPORT
exports.getRevenueReport =
async (req, res) => {
  try {

    const revenue =
    await Payment.aggregate([
      {
        $match: {
          status: "success"
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount"
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      totalRevenue:
      revenue[0]?.totalRevenue || 0
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// MEMBERSHIP REPORT
exports.getMembershipReport =
async (req, res) => {
  try {

    const active =
    await UserSubscription.countDocuments({
      status: "active"
    });

    const expired =
    await UserSubscription.countDocuments({
      status: "expired"
    });

    res.status(200).json({
      success: true,
      active,
      expired
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// USERS REPORT
exports.getUsersReport =
async (req, res) => {
  try {

    const totalUsers =
    await User.countDocuments({
      role: "user"
    });

    res.status(200).json({
      success: true,
      totalUsers
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// BRANCH REPORT
exports.getBranchReport =
async (req, res) => {
  try {

    const branches =
    await Branch.find();

    const report =
    await Promise.all(
      branches.map(
        async (branch) => {

          const users =
          await User.countDocuments({
            branchId:
            branch._id
          });

          return {
            branchName:
            branch.branchName,

            totalUsers:
            users
          };
        }
      )
    );

    res.status(200).json({
      success: true,
      report
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};