const express =
require("express");

const router =
express.Router(); 

const {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout
} = require(
  "../controllers/workout.controller"
);

const {
  protect
} = require(
  "../middleware/auth.middleware"
);

const {
  authorize
} = require(
  "../middleware/role.middleware"
);

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: Workout Template Management APIs
 */

/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Create Workout Template
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goalGroupId:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Workout created successfully
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  createWorkout
);

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Get All Workouts
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workouts fetched successfully
 */
router.get(
  "/",
  protect,
  getWorkouts
);

/**
 * @swagger
 * /api/workouts/{id}:
 *   get:
 *     summary: Get Workout By ID
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout fetched successfully
 */
router.get(
  "/:id",
  protect,
  getWorkoutById
);

/**
 * @swagger
 * /api/workouts/{id}:
 *   put:
 *     summary: Update Workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout updated successfully
 */
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateWorkout
);

/**
 * @swagger
 * /api/workouts/{id}:
 *   delete:
 *     summary: Delete Workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout deleted successfully
 */
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteWorkout
);

module.exports =
router;