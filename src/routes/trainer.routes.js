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

router.post(
"/",
protect,
authorize("admin"),
createTrainer
);

router.get(
"/",
protect,
authorize("admin"),
getTrainers
);

router.put(
"/:id",
protect,
authorize("admin"),
updateTrainer
);

router.delete(
"/:id",
protect,
authorize("admin"),
deleteTrainer
);

module.exports =
router;