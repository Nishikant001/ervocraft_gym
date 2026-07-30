const express =
require("express");

const router =
express.Router();

const {
 createDiet,
 getDiets,
 getDietById,
 updateDiet,
 deleteDiet
}
=
require(
"../controllers/diet.controller"
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
 *   name: Diets
 *   description: Diet Management APIs
 */

/**
 * @swagger
 * /api/diets:
 *   post:
 *     summary: Create Diet Plan
 *     tags: [Diets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goalGroupId:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Diet created successfully
 */
router.post(
"/",
protect,
authorize("admin"),
createDiet
);

/**
 * @swagger
 * /api/diets:
 *   get:
 *     summary: Get All Diet Plans
 *     tags: [Diets]
 *     responses:
 *       200:
 *         description: Diet plans fetched successfully
 */
router.get(
"/",
getDiets
);

/**
 * @swagger
 * /api/diets/{id}:
 *   get:
 *     summary: Get Diet By ID
 *     tags: [Diets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diet fetched successfully
 */
router.get(
"/:id",
getDietById
);

/**
 * @swagger
 * /api/diets/{id}:
 *   put:
 *     summary: Update Diet Plan
 *     tags: [Diets]
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
 *         description: Diet updated successfully
 */
router.put(
"/:id",
protect,
authorize("admin"),
updateDiet
);

/**
 * @swagger
 * /api/diets/{id}:
 *   delete:
 *     summary: Delete Diet Plan
 *     tags: [Diets]
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
 *         description: Diet deleted successfully
 */
router.delete(
"/:id",
protect,
authorize("admin"),
deleteDiet
);

module.exports =
router;