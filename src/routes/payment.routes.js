const express =
require("express");

const router =
express.Router();

const {

 createOrder,

 verifyPayment

}
=
require(
"../controllers/payment.controller"
);

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Razorpay Payment APIs
 */

/**
 * @swagger
 * /api/payments/create-order:
 *   post:
 *     summary: Create Razorpay Order
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 999
 *     responses:
 *       200:
 *         description: Razorpay order created successfully
 */
router.post(
"/create-order",
createOrder
);

/**
 * @swagger
 * /api/payments/verify-payment:
 *   post:
 *     summary: Verify Razorpay Payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified successfully
 */
router.post(
"/verify-payment",
verifyPayment
);

module.exports =
router;