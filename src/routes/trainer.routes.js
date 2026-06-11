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

 createTrainer,
 getTrainers,
 updateTrainer,
 deleteTrainer

}
=
require(
"../controllers/trainer.controller"
);

/**
 * @swagger
 * tags:
 *   name: Trainers
 *   description: Trainer Management APIs
 */

/**
 * @swagger
 * /api/trainers:
 *   post:
 *     summary: Create Trainer
 *     tags: [Trainers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               specialization:
 *                 type: string
 *               experience:
 *                 type: number
 *     responses:
 *       201:
 *         description: Trainer created successfully
 */
router.post(
"/",
protect,
authorize("admin"),
createTrainer
);

/**
 * @swagger
 * /api/trainers:
 *   get:
 *     summary: Get All Trainers
 *     tags: [Trainers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trainers fetched successfully
 */
router.get(
"/",
protect,
authorize("admin"),
getTrainers
);

/**
 * @swagger
 * /api/trainers/{id}:
 *   put:
 *     summary: Update Trainer
 *     tags: [Trainers]
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
 *         description: Trainer updated successfully
 */
router.put(
"/:id",
protect,
authorize("admin"),
updateTrainer
);

/**
 * @swagger
 * /api/trainers/{id}:
 *   delete:
 *     summary: Delete Trainer
 *     tags: [Trainers]
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
 *         description: Trainer deleted successfully
 */
router.delete(
"/:id",
protect,
authorize("admin"),
deleteTrainer
);

module.exports =
router;