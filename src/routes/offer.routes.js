const express = require("express");

const router = express.Router();

const {
  createOffer,
  getOffers,
  updateOffer,
  deleteOffer,
} = require(
  "../controllers/offer.controller"
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

const upload = require(
  "../middleware/upload.middleware"
);

/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: Offer & Promotion Management APIs
 */

/**
 * @swagger
 * /api/offers:
 *   post:
 *     summary: Create Offer
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: New Year Offer
 *
 *               description:
 *                 type: string
 *                 example: Get special discount this month
 *
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Offer banner image
 *
 *               discountType:
 *                 type: string
 *                 enum:
 *                   - percentage
 *                   - fixed
 *                 example: percentage
 *
 *               discountValue:
 *                 type: number
 *                 example: 20
 *
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-10
 *
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-31
 *
 *               status:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       201:
 *         description: Offer created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  createOffer
);

/**
 * @swagger
 * /api/offers:
 *   get:
 *     summary: Get All Offers
 *     tags: [Offers]
 *     responses:
 *       200:
 *         description: Offers fetched successfully
 */
router.get(
  "/",
  getOffers
);

/**
 * @swagger
 * /api/offers/{id}:
 *   put:
 *     summary: Update Offer
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Offer MongoDB ID
 *         schema:
 *           type: string
 *         example: 66b123456789abcdef123456
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *
 *               title:
 *                 type: string
 *                 example: Summer Special Offer
 *
 *               description:
 *                 type: string
 *                 example: Get special discount on premium membership.
 *
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New offer banner image
 *
 *               discountType:
 *                 type: string
 *                 enum:
 *                   - percentage
 *                   - fixed
 *                 example: percentage
 *
 *               discountValue:
 *                 type: number
 *                 example: 25
 *
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-10
 *
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-31
 *
 *               status:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Offer updated successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       404:
 *         description: Offer not found
 *
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  updateOffer
);

/**
 * @swagger
 * /api/offers/{id}:
 *   delete:
 *     summary: Delete Offer
 *     tags: [Offers]
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
 *         description: Offer deleted successfully
 */
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteOffer
);

module.exports = router;