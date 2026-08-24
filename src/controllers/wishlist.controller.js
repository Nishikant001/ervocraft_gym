const Wishlist =
  require("../models/Wishlist");

const Product =
  require("../models/Product");


// =====================================================
// ADD TO WISHLIST
// =====================================================

exports.addToWishlist =
async (req, res) => {

  try {

    const {
      productId
    } = req.body;


    // Check product exists

    const product =
      await Product.findById(
        productId
      );

    if (!product) {

      return res.status(404).json({

        success: false,

        message:
          "Product not found"

      });

    }


    // Find user's wishlist

    let wishlist =
      await Wishlist.findOne({

        userId:
          req.user._id

      });


    // Create wishlist
    // for first-time user

    if (!wishlist) {

      wishlist =
        await Wishlist.create({

          userId:
            req.user._id,

          products: [
            productId
          ]

        });

    }

    else {

      // Check already exists

      const alreadyExists =
        wishlist.products.some(

          id =>
            id.toString() ===
            productId

        );


      if (alreadyExists) {

        return res.status(200).json({

          success: true,

          alreadyInWishlist: true,

          message:
            "Product already in wishlist",

          wishlist

        });

      }


      // Add product

      wishlist.products.push(
        productId
      );

      await wishlist.save();

    }


    await wishlist.populate(
      "products"
    );


    res.status(200).json({

      success: true,

      alreadyInWishlist: false,

      message:
        "Product added to wishlist",

      wishlist

    });


  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};



// =====================================================
// GET MY WISHLIST
// =====================================================

exports.getWishlist =
async (req, res) => {

  try {

    const wishlist =
      await Wishlist.findOne({

        userId:
          req.user._id

      }).populate(
        "products"
      );


    res.status(200).json({

      success: true,

      wishlist

    });


  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};



// =====================================================
// REMOVE FROM WISHLIST
// =====================================================

exports.removeFromWishlist =
async (req, res) => {

  try {

    const {
      productId
    } = req.params;


    const wishlist =
      await Wishlist.findOne({

        userId:
          req.user._id

      });


    if (!wishlist) {

      return res.status(404).json({

        success: false,

        message:
          "Wishlist not found"

      });

    }


    wishlist.products =
      wishlist.products.filter(

        id =>
          id.toString() !==
          productId

      );


    await wishlist.save();


    await wishlist.populate(
      "products"
    );


    res.status(200).json({

      success: true,

      message:
        "Product removed from wishlist",

      wishlist

    });


  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};