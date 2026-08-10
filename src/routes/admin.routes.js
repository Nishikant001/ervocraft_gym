const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const { authorize } = require("../middleware/role.middleware");

const {
  getDashboard,

  getUsers,
  updateUser,

  getUserById,

  changeUserStatus,

  deleteUser,
  getUserCountByStatus,
  getRecentMembers,
} = require("../controllers/admin.controller");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin Management APIs
 */

router.use(protect, authorize("admin"));

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get Admin Dashboard Data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 */
router.get("/dashboard", getDashboard);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get All Users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */
router.get("/users", getUsers);

/**
 * @swagger
 * /api/admin/users/count/status:
 *   get:
 *     summary: Get User Count By Status
 *     description: Returns total, active, and inactive user counts.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User count fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 50
 *                     activeUsers:
 *                       type: integer
 *                       example: 42
 *                     inactiveUsers:
 *                       type: integer
 *                       example: 8
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/users/count/status", getUserCountByStatus);

/**
 * @swagger
 * /api/admin/users/recent:
 *   get:
 *     summary: Get Recent Members
 *     description: Returns the most recently joined users.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of recent members to return
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 10
 *     responses:
 *       200:
 *         description: Recent members fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64f123456789abcdef123456"
 *                       fullName:
 *                         type: string
 *                         example: "Rahul Kumar"
 *                       email:
 *                         type: string
 *                         example: "rahul@gmail.com"
 *                       mobile:
 *                         type: string
 *                         example: "9876543210"
 *                       role:
 *                         type: string
 *                         example: "user"
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       branchId:
 *                         type: object
 *                       subscriptionPlanId:
 *                         type: object
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-08-10T08:30:00.000Z"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/users/recent", getRecentMembers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get User By ID
 *     tags: [Admin]
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
 *         description: User fetched successfully
 */
router.get("/users/:id", getUserById);

/**
 * @swagger
 * /api/admin/users/{id}/status:
 *   patch:
 *     summary: Change User Status
 *     tags: [Admin]
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
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User status updated
 */
router.patch("/users/:id/status", changeUserStatus);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete User
 *     tags: [Admin]
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
 *         description: User deleted successfully
 */
router.delete("/users/:id", deleteUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update User
 *     tags: [Admin]
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
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               branchId:
 *                 type: string
 *               subscriptionPlanId:
 *                 type: string
 *               role:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put("/users/:id", updateUser);

module.exports = router;
