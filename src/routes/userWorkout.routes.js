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

// const {

//  assignWorkout,

//  getAssignments,

//  getMyWorkouts,

//  updateWorkoutStatus

// }
// =
// require(
// "../controllers/userWorkout.controller"
// );

// /**
//  * @swagger
//  * tags:
//  *   name: User Workouts
//  *   description: Workout Assignment & User Workout APIs
//  */

// /**
//  * @swagger
//  * /api/user-workouts/assign:
//  *   post:
//  *     summary: Assign Workout To User
//  *     tags: [User Workouts]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               userId:
//  *                 type: string
//  *               workoutId:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Workout assigned successfully
//  */
// router.post(
// "/assign",
// protect,
// authorize(
// "admin",
// // "trainer",
// "user"
// ),
// assignWorkout
// );

// /**
//  * @swagger
//  * /api/user-workouts/assignments:
//  *   get:
//  *     summary: Get All Workout Assignments
//  *     tags: [User Workouts]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Workout assignments fetched successfully
//  */
// router.get(
// "/assignments",
// protect,
// authorize(
// "admin",
// // "trainer",
// "user"
// ),
// getAssignments
// );

// /**
//  * @swagger
//  * /api/user-workouts/{id}/status:
//  *   patch:
//  *     summary: Update Workout Assignment Status
//  *     tags: [User Workouts]
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
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               status:
//  *                 type: string
//  *                 example: completed
//  *     responses:
//  *       200:
//  *         description: Workout status updated successfully
//  */
// router.patch(
// "/:id/status",
// protect,
// authorize(
// "admin",
// // "trainer",
// "user"
// ),
// updateWorkoutStatus
// );

// /**
//  * @swagger
//  * /api/user-workouts/my-workouts:
//  *   get:
//  *     summary: Get My Assigned Workouts
//  *     tags: [User Workouts]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: User workouts fetched successfully
//  */
// router.get(
// "/my-workouts",
// protect,
// getMyWorkouts
// );

// module.exports =
// router;


const express =
require("express");

const router =
express.Router();

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

const {
  startWorkout,
  getAssignments,
  getMyWorkouts,
  updateWorkoutStatus
} = require(
  "../controllers/userWorkout.controller"
);


/**
 * @swagger
 * tags:
 *   name: User Workouts
 *   description: Workout Assignment & User Workout APIs
 */


/**
 * @swagger
 * /api/user-workouts/assign:
 *   post:
 *     summary: Start Workout For User
 *     tags: [User Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workoutTemplateId
 *               - startDate
 *               - endDate
 *             properties:
 *               workoutTemplateId:
 *                 type: string
 *                 example: 6a7901230a5432f930bb7001
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-09
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-11-01
 *               notes:
 *                 type: string
 *                 example: Started from workout library
 *     responses:
 *       201:
 *         description: Workout started successfully
 */
router.post(
  "/assign",
  protect,
  authorize(
    "admin",
    "user"
  ),
  startWorkout
);


/**
 * @swagger
 * /api/user-workouts/assignments:
 *   get:
 *     summary: Get All Workout Assignments
 *     tags: [User Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workout assignments fetched successfully
 */
router.get(
  "/assignments",
  protect,
  authorize(
    "admin",
    "user"
  ),
  getAssignments
);


/**
 * @swagger
 * /api/user-workouts/{id}/status:
 *   patch:
 *     summary: Update Workout Assignment Status
 *     tags: [User Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: completed
 *     responses:
 *       200:
 *         description: Workout status updated successfully
 */
router.patch(
  "/:id/status",
  protect,
  authorize(
    "admin",
    "user"
  ),
  updateWorkoutStatus
);


/**
 * @swagger
 * /api/user-workouts/my-workouts:
 *   get:
 *     summary: Get My Assigned Workouts
 *     tags: [User Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User workouts fetched successfully
 */
router.get(
  "/my-workouts",
  protect,
  getMyWorkouts
);


module.exports =
router;