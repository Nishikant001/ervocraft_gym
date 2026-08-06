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

const upload =
require(
"../middleware/upload.middleware"
);

const {

 createExercise,
 getExercises,
 getExerciseById,
 updateExercise,
 deleteExercise

}
=
require(
"../controllers/exercise.controller"
);

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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               muscleGroup:
 *                 type: string
 *               description:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               caloriesBurnPerMinute:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Exercise created successfully
 */
router.post(
"/",
protect,
authorize("admin"),
upload.exerciseMedia.fields([
 {name:"thumbnail",maxCount:1},
 {name:"video",maxCount:1}
]),
createExercise
);

/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Get All Exercises
 *     tags: [Exercises]
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exercise fetched successfully
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 */
router.put(
"/:id",
protect,
authorize("admin"),
upload.exerciseMedia.fields([
 {name:"thumbnail",maxCount:1},
 {name:"video",maxCount:1}
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exercise deleted successfully
 */
router.delete(
"/:id",
protect,
authorize("admin"),
deleteExercise
);

module.exports =
router;