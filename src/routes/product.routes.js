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

const upload =
require(
  "../middleware/upload.middleware"
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
 *     description: Create a new product with multiple product images.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryId
 *               - brand
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Whey Protein
 *
 *               categoryId:
 *                 type: string
 *                 example: 65f123456789abcdef123456
 *
 *               brand:
 *                 type: string
 *                 example: MuscleBlaze
 *
 *               description:
 *                 type: string
 *                 example: Premium whey protein supplement
 *
 *               price:
 *                 type: number
 *                 example: 2999
 *
 *               salePrice:
 *                 type: number
 *                 example: 2499
 *
 *               stock:
 *                 type: number
 *                 example: 50
 *
 *               flavors:
 *                 type: string
 *                 example: Chocolate, Vanilla, Mango
 *                 description: Comma-separated flavor names
 *
 *               weight:
 *                 type: string
 *                 example: 1kg
 *
 *               status:
 *                 type: boolean
 *                 example: true
 *
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images. Maximum 10 images, 5MB each.
 *
 *     responses:
 *       201:
 *         description: Product created successfully
 *
 *       400:
 *         description: Invalid product data
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images", 10),
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
 *
 *       500:
 *         description: Server error
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
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product MongoDB ID
 *         schema:
 *           type: string
 *         example: 65f123456789abcdef123456
 *
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *
 *       404:
 *         description: Product not found
 *
 *       500:
 *         description: Server error
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
 *     description: Update product details and optionally upload new product images.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product MongoDB ID
 *         schema:
 *           type: string
 *         example: 65f123456789abcdef123456
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Whey Protein
 *
 *               categoryId:
 *                 type: string
 *                 example: 65f123456789abcdef123456
 *
 *               brand:
 *                 type: string
 *                 example: MuscleBlaze
 *
 *               description:
 *                 type: string
 *                 example: Premium whey protein supplement
 *
 *               price:
 *                 type: number
 *                 example: 2999
 *
 *               salePrice:
 *                 type: number
 *                 example: 2499
 *
 *               stock:
 *                 type: number
 *                 example: 50
 *
 *               flavors:
 *                 type: string
 *                 example: Chocolate, Vanilla, Mango
 *                 description: Comma-separated flavor names
 *
 *               weight:
 *                 type: string
 *                 example: 1kg
 *
 *               status:
 *                 type: boolean
 *                 example: true
 *
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: New product images. Maximum 10 images, 5MB each.
 *
 *     responses:
 *       200:
 *         description: Product updated successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       404:
 *         description: Product not found
 *
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.array("images", 10),
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
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product MongoDB ID
 *         schema:
 *           type: string
 *         example: 65f123456789abcdef123456
 *
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       404:
 *         description: Product not found
 *
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProduct
);


module.exports =
router;