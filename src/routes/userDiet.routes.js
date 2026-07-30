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

 assignDiet,

 getMyDiets,

 saveDietProgress,

 getDietProgress

}
=
require(
"../controllers/userDiet.controller"
);

/**
 * @swagger
 * tags:
 *   name: User Diets
 *   description: Diet Assignment & Diet Progress APIs
 */

/**
 * @swagger
 * /api/user-diets/assign:
 *   post:
 *     summary: Assign Diet To User
 *     tags: [User Diets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               dietId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Diet assigned successfully
 */
router.post(
"/assign",
protect,
authorize(
"admin",
"trainer"
),
assignDiet
);

/**
 * @swagger
 * /api/user-diets/my-diets:
 *   get:
 *     summary: Get My Assigned Diets
 *     tags: [User Diets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assigned diets fetched successfully
 */
router.get(
"/my-diets",
protect,
getMyDiets
);

/**
 * @swagger
 * /api/user-diets/progress:
 *   post:
 *     summary: Save Diet Progress
 *     tags: [User Diets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mealType:
 *                 type: string
 *                 example: breakfast
 *               completed:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Diet progress saved successfully
 */
router.post(
"/progress",
protect,
saveDietProgress
);

/**
 * @swagger
 * /api/user-diets/progress:
 *   get:
 *     summary: Get Diet Progress History
 *     tags: [User Diets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Diet progress fetched successfully
 */
router.get(
"/progress",
protect,
getDietProgress
);

module.exports =
router;