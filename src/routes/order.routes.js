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

 createOrder,
 getMyOrders,
 updateOrderStatus

}
=
require(
"../controllers/order.controller"
);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order Management APIs
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create New Order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddress:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post(
"/",
protect,
createOrder
);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get My Orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User orders fetched successfully
 */
router.get(
"/my-orders",
protect,
getMyOrders
);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update Order Status
 *     tags: [Orders]
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
 *               status:
 *                 type: string
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.patch(
"/:id/status",
protect,
authorize("admin"),
updateOrderStatus
);

module.exports =
router;