const Offer = require("../models/Offer");

// CREATE OFFER
exports.createOffer = async (req, res) => {
  try {
    const offer = await Offer.create({
      ...req.body,
      imageUrl: req.file
        ? req.file.path
        : req.body.imageUrl,
    });

    res.status(201).json({
      success: true,
      offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL OFFERS
exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      offers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE OFFER
exports.updateOffer = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    res.status(200).json({
      success: true,
      offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE OFFER
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(
      req.params.id
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};