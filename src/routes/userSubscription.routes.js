const express = require("express");

const router =
express.Router();

const {
 getMySubscription
}
=
require(
"../controllers/userSubscription.controller"
);

const {
 protect
}
=
require(
"../middleware/auth.middleware"
);

/**
 * @swagger
 * tags:
 *   name: User Subscription
 *   description: User Membership APIs
 */

/**
 * @swagger
 * /api/user-subscriptions/my-subscription:
 *   get:
 *     summary: Get Current User Subscription
 *     tags: [User Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User subscription fetched successfully
 */
router.get(
"/my-subscription",
protect,
getMySubscription
);

module.exports = router;