const express = require("express");

const router = express.Router();

const {
  createBranch,
  getBranches,
  updateBranch,
  deleteBranch,
} = require(
  "../controllers/branch.controller"
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
  createBranch
);

router.get(
  "/",
  getBranches
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateBranch
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteBranch
);

module.exports = router;