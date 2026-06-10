const express = require("express");

const router = express.Router();

const {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan,
} = require(
  "../controllers/subscription.controller"
);

const {
  protect,
} = require(
  "../middleware/auth.middleware"
);

const {
  authorize,
} = require(
  "../middleware/role.middleware"
);

router.post(
  "/",
  protect,
  authorize("admin"),
  createPlan
);

router.get(
  "/",
  getPlans
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updatePlan
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deletePlan
);

module.exports = router;