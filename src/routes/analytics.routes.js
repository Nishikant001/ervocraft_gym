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

 getRevenueByBranch,

 getMembersByBranch,

 getMembershipAnalytics,

 getWorkoutAnalytics,

 getDashboardAnalytics

}
=
require(
"../controllers/analytics.controller"
);

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics & Dashboard APIs
 */

router.use(
 protect,
 authorize("admin")
);

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get Overall Dashboard Analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard analytics fetched successfully
 */
router.get(
"/dashboard",
getDashboardAnalytics
);

/**
 * @swagger
 * /api/analytics/revenue:
 *   get:
 *     summary: Revenue Analytics By Branch
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue analytics fetched successfully
 */
router.get(
"/revenue",
getRevenueByBranch
);

/**
 * @swagger
 * /api/analytics/members:
 *   get:
 *     summary: Members Analytics By Branch
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Members analytics fetched successfully
 */
router.get(
"/members",
getMembersByBranch
);

/**
 * @swagger
 * /api/analytics/memberships:
 *   get:
 *     summary: Membership Analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Membership analytics fetched successfully
 */
router.get(
"/memberships",
getMembershipAnalytics
);

/**
 * @swagger
 * /api/analytics/workouts:
 *   get:
 *     summary: Workout Analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workout analytics fetched successfully
 */
router.get(
"/workouts",
getWorkoutAnalytics
);

module.exports =
router;