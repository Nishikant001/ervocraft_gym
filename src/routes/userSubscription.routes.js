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

router.get(
"/my-subscription",
protect,
getMySubscription
);

module.exports = router;