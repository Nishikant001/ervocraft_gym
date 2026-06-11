const Notification = require("../models/Notification");

// CREATE NOTIFICATION
exports.createNotification =
  async (req, res) => {
    try {
      const notification =
        await Notification.create(
          req.body
        );

      res.status(201).json({
        success: true,
        notification,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// GET ALL NOTIFICATIONS
exports.getNotifications =
  async (req, res) => {
    try {
      const notifications =
        await Notification.find()
          .populate("userId")
          .populate("branchId")
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// GET MY NOTIFICATIONS
exports.getMyNotifications =
  async (req, res) => {
    try {
      const notifications =
        await Notification.find({
          $or: [
            {
              targetType: "all",
            },
            {
              userId:
                req.user._id,
            },
            {
              branchId:
                req.user
                  .branchId,
            },
          ],
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// DELETE NOTIFICATION
exports.deleteNotification =
  async (req, res) => {
    try {
      const notification =
        await Notification.findByIdAndDelete(
          req.params.id
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Notification deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };