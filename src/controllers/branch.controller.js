const Branch = require("../models/Branch");

// CREATE
exports.createBranch =
  async (req, res) => {
    try {
      const branch =
        await Branch.create(req.body);

      res.status(201).json({
        success: true,
        branch,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// GET ALL
exports.getBranches =
  async (req, res) => {
    try {
      const branches =
        await Branch.find();

      res.status(200).json({
        success: true,
        branches,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// UPDATE
exports.updateBranch =
  async (req, res) => {
    try {
      const branch =
        await Branch.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );

      res.status(200).json({
        success: true,
        branch,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// DELETE
exports.deleteBranch =
  async (req, res) => {
    try {
      await Branch.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Branch deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };