const WorkoutTemplate =
require("../models/WorkoutTemplate");

// CREATE WORKOUT
exports.createWorkout =
async (req, res) => {
  try {

    const data = {
      ...req.body
    };

    if (typeof data.days === "string") {
      try {
        data.days = JSON.parse(data.days);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "days must be valid JSON"
        });
      }
    }

    if (req.file) {
      data.thumbnail = req.file.path || req.file.secure_url || req.file.url;
    }

    const workout =
    await WorkoutTemplate.create(
      data
    );

    res.status(201).json({
      success: true,
      workout
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// GET ALL WORKOUTS
exports.getWorkouts =
async (req, res) => {
  try {

    const workouts =
    await WorkoutTemplate
      .find()
      .populate("goalGroupId")
      .populate(
        "days.exercises.exerciseId"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      count: workouts.length,
      workouts
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// GET SINGLE WORKOUT
exports.getWorkoutById =
async (req, res) => {
  try {

    const workout =
    await WorkoutTemplate
      .findById(req.params.id)
      .populate("goalGroupId")
      .populate(
        "days.exercises.exerciseId"
      );

    if (!workout) {

      return res.status(404).json({
        success: false,
        message:
        "Workout not found"
      });

    }

    res.status(200).json({
      success: true,
      workout
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// UPDATE WORKOUT
exports.updateWorkout =
async (req, res) => {
  try {

    const updateData = {
      ...req.body
    };

    if (typeof updateData.days === "string") {
      try {
        updateData.days = JSON.parse(updateData.days);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "days must be valid JSON"
        });
      }
    }

    if (req.file) {
      updateData.thumbnail =
        req.file.path ||
        req.file.secure_url ||
        req.file.url;
    }

    const workout =
    await WorkoutTemplate
      .findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      )
      .populate("goalGroupId")
      .populate(
        "days.exercises.exerciseId"
      );

    if (!workout) {

      return res.status(404).json({
        success: false,
        message:
        "Workout not found"
      });

    }

    res.status(200).json({
      success: true,
      workout
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// DELETE WORKOUT
exports.deleteWorkout =
async (req, res) => {
  try {

    const workout =
    await WorkoutTemplate
      .findByIdAndDelete(
        req.params.id
      );

    if (!workout) {

      return res.status(404).json({
        success: false,
        message:
        "Workout not found"
      });

    }

    res.status(200).json({
      success: true,
      message:
      "Workout deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};