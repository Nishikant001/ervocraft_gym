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

 startWorkout,

 completeExercise,

 finishWorkout,

 getWorkoutHistory

}
=
require(
"../controllers/workoutSession.controller"
);

/**
 * @swagger
 * tags:
 *   name: Workout Sessions
 *   description: Workout Execution Engine APIs
 */

/**
 * @swagger
 * /api/workout-sessions/start:
 *   post:
 *     summary: Start Workout Session
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignedWorkoutId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Workout started successfully
 */
router.post(
"/start",
protect,
startWorkout
);

/**
 * @swagger
 * /api/workout-sessions/exercise-complete:
 *   post:
 *     summary: Complete Exercise
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *               exerciseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Exercise completed successfully
 */
router.post(
"/exercise-complete",
protect,
completeExercise
);

/**
 * @swagger
 * /api/workout-sessions/finish:
 *   post:
 *     summary: Finish Workout Session
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Workout finished successfully
 */
router.post(
"/finish",
protect,
finishWorkout
);

/**
 * @swagger
 * /api/workout-sessions/history:
 *   get:
 *     summary: Get Workout History
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workout history fetched successfully
 */
router.get(
"/history",
protect,
getWorkoutHistory
);

module.exports =
router;