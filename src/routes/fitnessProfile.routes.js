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

 saveProfile,
 getProfile,
 getUserFitnessProfile

}
=
require(
"../controllers/fitnessProfile.controller"
);

/**
 * @swagger
 * tags:
 *   name: Fitness Profile
 *   description: User Fitness Profile APIs
 */

/**
 * @swagger
 * /api/fitness-profile:
 *   post:
 *     summary: Create or Update Fitness Profile
 *     tags: [Fitness Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               age:
 *                 type: number
 *               gender:
 *                 type: string
 *               height:
 *                 type: number
 *               weight:
 *                 type: number
 *               goal:
 *                 type: string
 *               activityLevel:
 *                 type: string
 *               medicalConditions:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fitness profile saved successfully
 */
router.post(
"/",
protect,
saveProfile
);

/**
 * @swagger
 * /api/fitness-profile/me:
 *   get:
 *     summary: Get Logged In User Fitness Profile
 *     tags: [Fitness Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fitness profile fetched successfully
 */
router.get(
"/me",
protect,
getProfile
);

/**
 * @swagger
 * /api/fitness-profile/user/{userId}:
 *   get:
 *     summary: Get User Fitness Profile By User ID
 *     tags: [Fitness Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User fitness profile fetched successfully
 */
router.get(
"/user/:userId",
protect,
authorize(
"admin",
"trainer"
),
getUserFitnessProfile
);

module.exports =
router;