const express = require("express");

const router = express.Router();

const {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan,
} = require(
  "../controllers/subscription.controller"
);

const {
  protect,
} = require(
  "../middleware/auth.middleware"
);

const {
  authorize,
} = require(
  "../middleware/role.middleware"
);

/**
 * @swagger
 * tags:
 *   name: Subscription Plans
 *   description: Membership Plan Management APIs
 */

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Create Subscription Plan
 *     tags: [Subscription Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planName:
 *                 type: string
 *               duration:
 *                 type: number
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subscription plan created successfully
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  createPlan
);

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Get All Subscription Plans
 *     tags: [Subscription Plans]
 *     responses:
 *       200:
 *         description: Plans fetched successfully
 */
router.get(
  "/",
  getPlans
);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   put:
 *     summary: Update Subscription Plan
 *     tags: [Subscription Plans]
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
 *         description: Subscription plan updated successfully
 */
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updatePlan
);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Delete Subscription Plan
 *     tags: [Subscription Plans]
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
 *         description: Subscription plan deleted successfully
 */
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deletePlan
);

module.exports = router;