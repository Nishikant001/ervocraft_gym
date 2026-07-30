const express =
require("express");

const router =
express.Router();

const {
 protect
}
=
require(
"../middleware/auth.middleware"
);

const {
 authorize
}
=
require(
"../middleware/role.middleware"
);

const {

 assignWorkout,

 getAssignments,

 getMyWorkouts,

 updateWorkoutStatus

}
=
require(
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
 *     summary: Assign Workout To User
 *     tags: [User Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               workoutId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Workout assigned successfully
 */
router.post(
"/assign",
protect,
authorize(
"admin",
"trainer"
),
assignWorkout
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
"trainer"
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
"trainer"
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