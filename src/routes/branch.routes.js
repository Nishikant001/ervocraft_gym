const express = require("express");

const router = express.Router();

const {
  createBranch,
  getBranches,
  updateBranch,
  deleteBranch,
} = require(
  "../controllers/branch.controller"
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
 *   name: Branches
 *   description: Gym Branch Management APIs
 */

/**
 * @swagger
 * /api/branches:
 *   post:
 *     summary: Create New Branch
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branchName:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Branch created successfully
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  createBranch
);

/**
 * @swagger
 * /api/branches:
 *   get:
 *     summary: Get All Branches
 *     tags: [Branches]
 *     responses:
 *       200:
 *         description: Branches fetched successfully
 */
router.get(
  "/",
  getBranches
);

/**
 * @swagger
 * /api/branches/{id}:
 *   put:
 *     summary: Update Branch
 *     tags: [Branches]
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
 *         description: Branch updated successfully
 */
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateBranch
);

/**
 * @swagger
 * /api/branches/{id}:
 *   delete:
 *     summary: Delete Branch
 *     tags: [Branches]
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
 *         description: Branch deleted successfully
 */
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteBranch
);

module.exports = router;