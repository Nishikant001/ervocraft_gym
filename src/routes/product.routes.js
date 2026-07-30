const express =
require("express");

const router =
express.Router();

const {
 createProduct,
 getProducts,
 getProductById,
 updateProduct,
 deleteProduct
}
=
require(
"../controllers/product.controller"
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
 *   name: Products
 *   description: Supplement Store Product APIs
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create Product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post(
"/",
protect,
authorize("admin"),
createProduct
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get All Products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products fetched successfully
 */
router.get(
"/",
getProducts
);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get Product By ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product fetched successfully
 */
router.get(
"/:id",
getProductById
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update Product
 *     tags: [Products]
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
 *         description: Product updated successfully
 */
router.put(
"/:id",
protect,
authorize("admin"),
updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete Product
 *     tags: [Products]
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
 *         description: Product deleted successfully
 */
router.delete(
"/:id",
protect,
authorize("admin"),
deleteProduct
);

module.exports =
router;