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

 getRevenueReport,
 getMembershipReport,
 getUsersReport,
 getBranchReport

}
=
require(
"../controllers/report.controller"
);

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Admin Reports APIs
 */

/**
 * @swagger
 * /api/reports/revenue:
 *   get:
 *     summary: Revenue Report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue report fetched successfully
 */
router.get(
"/revenue",
protect,
authorize("admin"),
getRevenueReport
);

/**
 * @swagger
 * /api/reports/memberships:
 *   get:
 *     summary: Membership Report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Membership report fetched successfully
 */
router.get(
"/memberships",
protect,
authorize("admin"),
getMembershipReport
);

/**
 * @swagger
 * /api/reports/users:
 *   get:
 *     summary: Users Report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users report fetched successfully
 */
router.get(
"/users",
protect,
authorize("admin"),
getUsersReport
);

/**
 * @swagger
 * /api/reports/branches:
 *   get:
 *     summary: Branch Report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Branch report fetched successfully
 */
router.get(
"/branches",
protect,
authorize("admin"),
getBranchReport
);

module.exports =
router;