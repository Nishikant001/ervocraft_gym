const express =
require("express");

const router =
express.Router();

const {
 createGoal,
 getGoals,
 updateGoal,
 deleteGoal
}
=
require(
"../controllers/goal.controller"
);

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

/**
 * @swagger
 * tags:
 *   name: Goal Groups
 *   description: Fitness Goal Management APIs
 */

/**
 * @swagger
 * /api/goals:
 *   post:
 *     summary: Create Goal Group
 *     tags: [Goal Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Weight Loss
 *               description:
 *                 type: string
 *                 example: Goal for losing body fat
 *     responses:
 *       201:
 *         description: Goal created successfully
 */
router.post(
"/",
protect,
authorize("admin"),
createGoal
);

/**
 * @swagger
 * /api/goals:
 *   get:
 *     summary: Get All Goal Groups
 *     tags: [Goal Groups]
 *     responses:
 *       200:
 *         description: Goal list fetched successfully
 */
router.get(
"/",
getGoals
);

/**
 * @swagger
 * /api/goals/{id}:
 *   put:
 *     summary: Update Goal Group
 *     tags: [Goal Groups]
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
 *         description: Goal updated successfully
 */
router.put(
"/:id",
protect,
authorize("admin"),
updateGoal
);

/**
 * @swagger
 * /api/goals/{id}:
 *   delete:
 *     summary: Delete Goal Group
 *     tags: [Goal Groups]
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
 *         description: Goal deleted successfully
 */
router.delete(
"/:id",
protect,
authorize("admin"),
deleteGoal
);

module.exports =
router;