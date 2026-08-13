const Product =
require("../models/Product");

// CREATE
exports.createProduct = async (req, res) => {

  try {

    const imageUrls = req.files
      ? req.files.map(file => file.path)
      : [];

    const productData = {
      ...req.body,
      images: imageUrls
    };

    if (typeof req.body.flavors === "string") {

      productData.flavors =
        req.body.flavors
          .split(",")
          .map(item => item.trim())
          .filter(Boolean);

    }

    const product =
      await Product.create(productData);

    res.status(201).json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// GET ALL
exports.getProducts =
async(req,res)=>{

 try{

   const products =
   await Product.find()
   .populate("categoryId");

   res.status(200).json({
      success:true,
      products
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// GET SINGLE
exports.getProductById =
async(req,res)=>{

 try{

   const product =
   await Product.findById(
      req.params.id
   )
   .populate("categoryId");

   res.status(200).json({
      success:true,
      product
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

// UPDATE
exports.updateProduct = async (req, res) => {

  try {

    const product =
      await Product.findById(req.params.id);

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });

    }

    const updateData = {
      ...req.body
    };

    // New images uploaded
    if (req.files && req.files.length > 0) {

      updateData.images =
        req.files.map(
          file => file.path
        );

    }

    if (typeof req.body.flavors === "string") {

      updateData.flavors =
        req.body.flavors
          .split(",")
          .map(item => item.trim())
          .filter(Boolean);

    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

    res.status(200).json({
      success: true,
      product: updatedProduct
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// DELETE
exports.deleteProduct =
async(req,res)=>{

 try{

   await Product.findByIdAndDelete(
      req.params.id
   );

   res.status(200).json({
      success:true,
      message:
      "Product deleted"
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};