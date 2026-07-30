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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               discount:
 *                 type: number
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Offer created successfully
 */
router.post(
  "/",
  protect,
  authorize("admin"),
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
 *         description: Offer updated successfully
 */
router.put(
  "/:id",
  protect,
  authorize("admin"),
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