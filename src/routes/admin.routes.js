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

 getDashboard,

 getUsers,

 getUserById,

 changeUserStatus,

 deleteUser

}
=
require(
"../controllers/admin.controller"
);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin Management APIs
 */

router.use(
 protect,
 authorize("admin")
);

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
router.get(
 "/dashboard",
 getDashboard
);

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
router.get(
 "/users",
 getUsers
);

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
router.get(
 "/users/:id",
 getUserById
);

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
router.patch(
 "/users/:id/status",
 changeUserStatus
);

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
router.delete(
 "/users/:id",
 deleteUser
);

module.exports =
router;