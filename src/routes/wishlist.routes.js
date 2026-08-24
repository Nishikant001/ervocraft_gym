const express =
  require("express");

const router =
  express.Router();


const {
  protect
} =
  require(
    "../middleware/auth.middleware"
  );


const {

  addToWishlist,

  getWishlist,

  removeFromWishlist

} =
  require(
    "../controllers/wishlist.controller"
  );



// ADD

router.post(
  "/add",
  protect,
  addToWishlist
);



// GET

router.get(
  "/",
  protect,
  getWishlist
);



// REMOVE

router.delete(
  "/:productId",
  protect,
  removeFromWishlist
);


module.exports =
  router;