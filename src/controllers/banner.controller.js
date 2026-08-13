const Banner = require("../models/Banner");

// CREATE BANNER
exports.createBanner =
async (req, res) => {
  try {

    const banner =
    await Banner.create({
      ...req.body,
      image:
      req.file ?
      req.file.path :
      req.body.image
    });

    res.status(201).json({
      success: true,
      banner
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// GET ALL BANNERS
exports.getBanners =
async (req, res) => {
  try {

    const banners =
    await Banner.find()
    .sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      banners
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// UPDATE BANNER
exports.updateBanner =
async (req, res) => {
  try {

    const updateData = {
      ...req.body
    };
 
    if (req.file) {
      updateData.image = req.file.path;
    }

    const banner =
    await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    res.status(200).json({
      success: true,
      banner
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// DELETE BANNER
exports.deleteBanner =
async (req, res) => {
  try {

    const banner =
    await Banner.findByIdAndDelete(
      req.params.id
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    res.status(200).json({
      success: true,
      message:
      "Banner deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};