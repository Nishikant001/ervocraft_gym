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

 addToCart,
 updateCartQuantity,
 getCart,
 removeCartItem

}
=
require(
"../controllers/cart.controller"
);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping Cart APIs
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add Product To Cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 */
router.post(
"/add",
protect,
addToCart
);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get User Cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 */
router.get(
"/",
protect,
getCart
);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove Product From Cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 */

router.patch(
  "/:productId",
  protect,
  updateCartQuantity
);

router.delete(
"/:productId",
protect,
removeCartItem
);

module.exports =
router;