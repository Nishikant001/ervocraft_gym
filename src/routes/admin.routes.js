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

 getDashboard,

 getUsers,

 getUserById,

 changeUserStatus,

 deleteUser

}
=
require(
"../controllers/admin.controller"
);

router.use(
 protect,
 authorize("admin")
);

router.get(
 "/dashboard",
 getDashboard
);

router.get(
 "/users",
 getUsers
);

router.get(
 "/users/:id",
 getUserById
);

router.patch(
 "/users/:id/status",
 changeUserStatus
);

router.delete(
 "/users/:id",
 deleteUser
);

module.exports = router;