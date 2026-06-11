const express =
require("express");

const router =
express.Router();

const {
 createCategory,
 getCategories,
 updateCategory,
 deleteCategory
}
=
require(
"../controllers/category.controller"
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
 *   name: Categories
 *   description: Product Category Management APIs
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create Category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post(
"/",
protect,
authorize("admin"),
createCategory
);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get All Categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 */
router.get(
"/",
getCategories
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update Category
 *     tags: [Categories]
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
 *         description: Category updated successfully
 */
router.put(
"/:id",
protect,
authorize("admin"),
updateCategory
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete Category
 *     tags: [Categories]
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
 *         description: Category deleted successfully
 */
router.delete(
"/:id",
protect,
authorize("admin"),
deleteCategory
);

module.exports =
router;