// const express =
// require("express");

// const router =
// express.Router();

// const {
//  protect
// }
// =
// require(
// "../middleware/auth.middleware"
// );

// const {
//  authorize
// }
// =
// require(
// "../middleware/role.middleware"
// );

// const upload =
// require(
// "../middleware/upload.middleware"
// );

// const {

//  createExercise,
//  getExercises,
//  getExerciseById,
//  updateExercise,
//  deleteExercise

// }
// =
// require(
// "../controllers/exercise.controller"
// );

// /**
//  * @swagger
//  * tags:
//  *   name: Exercises
//  *   description: Exercise Library Management APIs
//  */

// /**
//  * @swagger
//  * /api/exercises:
//  *   post:
//  *     summary: Create Exercise
//  *     tags: [Exercises]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               category:
//  *                 type: string
//  *               muscleGroup:
//  *                 type: string
//  *               description:
//  *                 type: string
//  *               videoUrl:
//  *                 type: string
//  *               caloriesBurnPerMinute:
//  *                 type: number
//  *               thumbnail:
//  *                 type: string
//  *                 format: binary
//  *               video:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       201:
//  *         description: Exercise created successfully
//  */
// router.post(
// "/",
// protect,
// authorize("admin"),
// upload.exerciseMedia.fields([
//  {name:"thumbnail",maxCount:1},
//  {name:"video",maxCount:1}
// ]),
// createExercise
// );

// /**
//  * @swagger
//  * /api/exercises:
//  *   get:
//  *     summary: Get All Exercises
//  *     tags: [Exercises]
//  *     responses:
//  *       200:
//  *         description: Exercise list fetched successfully
//  */
// router.get(
// "/",
// getExercises
// );

// /**
//  * @swagger
//  * /api/exercises/{id}:
//  *   get:
//  *     summary: Get Exercise By ID
//  *     tags: [Exercises]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Exercise fetched successfully
//  */
// router.get(
// "/:id",
// getExerciseById
// );

// /**
//  * @swagger
//  * /api/exercises/{id}:
//  *   put:
//  *     summary: Update Exercise
//  *     tags: [Exercises]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *     responses:
//  *       200:
//  *         description: Exercise updated successfully
//  */
// router.put(
// "/:id",
// protect,
// authorize("admin"),
// upload.exerciseMedia.fields([
//  {name:"thumbnail",maxCount:1},
//  {name:"video",maxCount:1}
// ]),
// updateExercise
// );

// /**
//  * @swagger
//  * /api/exercises/{id}:
//  *   delete:
//  *     summary: Delete Exercise
//  *     tags: [Exercises]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Exercise deleted successfully
//  */
// router.delete(
// "/:id",
// protect,
// authorize("admin"),
// deleteExercise
// );

// module.exports =
// router;





const express = require("express");
const router = express.Router();

const {
  protect,
} = require("../middleware/auth.middleware");

const {
  authorize,
} = require("../middleware/role.middleware");

const upload = require("../middleware/upload.middleware");

const {
  createExercise,
  getExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
} = require("../controllers/exercise.controller");


/**
 * @swagger
 * tags:
 *   name: Exercises
 *   description: Exercise Library Management APIs
 */


/**
 * @swagger
 * /api/exercises:
 *   post:
 *     summary: Create Exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - muscleGroup
 *             properties:
 *
 *               name:
 *                 type: string
 *                 example: Jumping Jacks
 *
 *               muscleGroup:
 *                 type: string
 *                 enum:
 *                   - chest
 *                   - back
 *                   - shoulders
 *                   - biceps
 *                   - triceps
 *                   - legs
 *                   - abs
 *                   - cardio
 *                   - full_body
 *                 example: cardio
 *
 *               equipment:
 *                 type: string
 *                 enum:
 *                   - bodyweight
 *                   - dumbbell
 *                   - barbell
 *                   - machine
 *                   - cable
 *                   - kettlebell
 *                 example: bodyweight
 *
 *               difficulty:
 *                 type: string
 *                 enum:
 *                   - beginner
 *                   - intermediate
 *                   - advanced
 *                 example: beginner
 *
 *               description:
 *                 type: string
 *                 example: A simple full-body cardio exercise.
 *
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Stand upright with your feet together.
 *                   - Jump while spreading your feet apart.
 *                   - Raise your arms overhead.
 *                   - Return to the starting position.
 *
 *               videoUrl:
 *                 type: string
 *                 example: https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4
 *                 description: External exercise video URL
 *
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Exercise thumbnail image
 *
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Exercise demonstration video
 *
 *               caloriesBurnPerMinute:
 *                 type: number
 *                 example: 8
 *                 default: 5
 *
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 default: true
 *
 *     responses:
 *       201:
 *         description: Exercise created successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.exerciseMedia.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createExercise
);


/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Get All Active Exercises
 *     tags: [Exercises]
 *
 *     responses:
 *       200:
 *         description: Exercise list fetched successfully
 */
router.get(
  "/",
  getExercises
);


/**
 * @swagger
 * /api/exercises/{id}:
 *   get:
 *     summary: Get Exercise By ID
 *     tags: [Exercises]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exercise MongoDB ID
 *         schema:
 *           type: string
 *         example: 66b123456789abcdef123456
 *
 *     responses:
 *       200:
 *         description: Exercise fetched successfully
 *
 *       404:
 *         description: Exercise not found
 *
 *       500:
 *         description: Server error
 */
router.get(
  "/:id",
  getExerciseById
);


/**
 * @swagger
 * /api/exercises/{id}:
 *   put:
 *     summary: Update Exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exercise MongoDB ID
 *         schema:
 *           type: string
 *         example: 66b123456789abcdef123456
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *
 *               name:
 *                 type: string
 *                 example: Push Ups
 *
 *               muscleGroup:
 *                 type: string
 *                 enum:
 *                   - chest
 *                   - back
 *                   - shoulders
 *                   - biceps
 *                   - triceps
 *                   - legs
 *                   - abs
 *                   - cardio
 *                   - full_body
 *                 example: chest
 *
 *               equipment:
 *                 type: string
 *                 enum:
 *                   - bodyweight
 *                   - dumbbell
 *                   - barbell
 *                   - machine
 *                   - cable
 *                   - kettlebell
 *                 example: bodyweight
 *
 *               difficulty:
 *                 type: string
 *                 enum:
 *                   - beginner
 *                   - intermediate
 *                   - advanced
 *                 example: beginner
 *
 *               description:
 *                 type: string
 *                 example: Updated description for push up exercise.
 *
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Start in a high plank position.
 *                   - Lower your chest toward the floor.
 *                   - Push back to the starting position.
 *
 *               videoUrl:
 *                 type: string
 *                 example: https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4
 *                 description: External exercise video URL
 *
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: New exercise thumbnail
 *
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: New exercise video
 *
 *               caloriesBurnPerMinute:
 *                 type: number
 *                 example: 8
 *
 *               isActive:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       404:
 *         description: Exercise not found
 *
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.exerciseMedia.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateExercise
);


/**
 * @swagger
 * /api/exercises/{id}:
 *   delete:
 *     summary: Delete Exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exercise MongoDB ID
 *         schema:
 *           type: string
 *         example: 66b123456789abcdef123456
 *
 *     responses:
 *       200:
 *         description: Exercise deleted successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteExercise
);


module.exports = router;