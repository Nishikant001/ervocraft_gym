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

const upload =
require(
"../middleware/upload.middleware"
);

const {

 addProgress,

 getProgressHistory,

 addMeasurement,

 getMeasurements,

 addProgressPhoto,

 getProgressPhotos

}
=
require(
"../controllers/progress.controller"
);

/**
 * @swagger
 * tags:
 *   name: Progress Tracking
 *   description: User Progress, Measurements and Photos APIs
 */

/**
 * @swagger
 * /api/progress/weight:
 *   post:
 *     summary: Add Weight Progress
 *     tags: [Progress Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weight:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Weight progress added successfully
 */
router.post(
"/weight",
protect,
addProgress
);

/**
 * @swagger
 * /api/progress/weight:
 *   get:
 *     summary: Get Weight Progress History
 *     tags: [Progress Tracking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weight history fetched successfully
 */
router.get(
"/weight",
protect,
getProgressHistory
);

/**
 * @swagger
 * /api/progress/measurement:
 *   post:
 *     summary: Add Body Measurement
 *     tags: [Progress Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chest:
 *                 type: number
 *               waist:
 *                 type: number
 *               hips:
 *                 type: number
 *               biceps:
 *                 type: number
 *               thighs:
 *                 type: number
 *     responses:
 *       201:
 *         description: Measurement added successfully
 */
router.post(
"/measurement",
protect,
addMeasurement
);

/**
 * @swagger
 * /api/progress/measurement:
 *   get:
 *     summary: Get Body Measurements
 *     tags: [Progress Tracking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Measurements fetched successfully
 */
router.get(
"/measurement",
protect,
getMeasurements
);

/**
 * @swagger
 * /api/progress/photo:
 *   post:
 *     summary: Upload Progress Photo
 *     tags: [Progress Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Progress photo uploaded successfully
 */
router.post(
"/photo",
protect,
upload.single("imageUrl"),
addProgressPhoto
);

/**
 * @swagger
 * /api/progress/photo:
 *   get:
 *     summary: Get Progress Photos
 *     tags: [Progress Tracking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress photos fetched successfully
 */
router.get(
"/photo",
protect,
getProgressPhotos
);

module.exports =
router;