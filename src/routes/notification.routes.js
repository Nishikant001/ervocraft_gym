const express =
require("express");

const router =
express.Router();

const {
 createNotification,
 getNotifications,
 getMyNotifications,
 deleteNotification
}
=
require(
"../controllers/notification.controller"
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
 *   name: Notifications
 *   description: Notification Management APIs
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create Notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               targetRole:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: Notification created successfully
 */
router.post(
"/",
protect,
authorize("admin"),
createNotification
);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get All Notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 */
router.get(
"/",
protect,
authorize("admin"),
getNotifications
);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete Notification
 *     tags: [Notifications]
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
 *         description: Notification deleted successfully
 */
router.delete(
"/:id",
protect,
authorize("admin"),
deleteNotification
);

/**
 * @swagger
 * /api/notifications/my:
 *   get:
 *     summary: Get Logged In User Notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User notifications fetched successfully
 */
router.get(
"/my",
protect,
getMyNotifications
);

module.exports =
router;