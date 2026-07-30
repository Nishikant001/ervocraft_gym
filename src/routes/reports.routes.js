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

 revenueReport,
 membershipReport,
 workoutReport,
 dietReport

}
=
require(
"../controllers/reports.controller"
);

/**
 * @swagger
 * tags:
 *   name: Advanced Reports
 *   description: Analytics Based Reports APIs
 */

router.use(
 protect,
 authorize("admin")
);

/**
 * @swagger
 * /api/advanced-reports/revenue:
 *   get:
 *     summary: Advanced Revenue Report
 *     tags: [Advanced Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue analytics report
 */
router.get(
"/revenue",
revenueReport
);

/**
 * @swagger
 * /api/advanced-reports/memberships:
 *   get:
 *     summary: Advanced Membership Report
 *     tags: [Advanced Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Membership analytics report
 */
router.get(
"/memberships",
membershipReport
);

/**
 * @swagger
 * /api/advanced-reports/workouts:
 *   get:
 *     summary: Workout Analytics Report
 *     tags: [Advanced Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workout analytics report
 */
router.get(
"/workouts",
workoutReport
);

/**
 * @swagger
 * /api/advanced-reports/diets:
 *   get:
 *     summary: Diet Analytics Report
 *     tags: [Advanced Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Diet analytics report
 */
router.get(
"/diets",
dietReport
);

module.exports =
router;