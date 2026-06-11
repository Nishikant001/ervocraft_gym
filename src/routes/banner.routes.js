const express =
require("express");

const router =
express.Router();

const {
 createBanner,
 getBanners,
 updateBanner,
 deleteBanner
}
=
require(
"../controllers/banner.controller"
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
 *   name: Banners
 *   description: Banner Management APIs
 */

/**
 * @swagger
 * /api/banners:
 *   post:
 *     summary: Create Banner
 *     tags: [Banners]
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
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Banner created successfully
 */
router.post(
"/",
protect,
authorize("admin"),
createBanner
);

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Get All Banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Banner list fetched successfully
 */
router.get(
"/",
getBanners
);

/**
 * @swagger
 * /api/banners/{id}:
 *   put:
 *     summary: Update Banner
 *     tags: [Banners]
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
 *         description: Banner updated successfully
 */
router.put(
"/:id",
protect,
authorize("admin"),
updateBanner
);

/**
 * @swagger
 * /api/banners/{id}:
 *   delete:
 *     summary: Delete Banner
 *     tags: [Banners]
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
 *         description: Banner deleted successfully
 */
router.delete(
"/:id",
protect,
authorize("admin"),
deleteBanner
);

module.exports =
router;