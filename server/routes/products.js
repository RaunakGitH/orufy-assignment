const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

router.use(protect);

// get all products
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.published === "true") filter.isPublished = true;
    if (req.query.published === "false") filter.isPublished = false;
    const products = await Product.find(filter).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//add product
router.post("/", async (req, res) => {
  try {
    const {
      name,
      type,
      stock,
      mrp,
      sellingPrice,
      brandName,
      images,
      exchangeOrReturn,
    } = req.body;
    if (!name || !type || stock == null || !mrp || !sellingPrice) {
      return res.status(400).json({
        success: false,
        message: "missing fields",
      });
    }
    const product = await Product.create({
      name,
      type,
      stock,
      mrp,
      sellingPrice,
      brandName,
      images,
      exchangeOrReturn,
    });
    res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//update product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// toggle publish/unpublish
router.patch("/:id/publish", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    product.isPublished = !product.isPublished;
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.isPublished ? "published" : "unpublished"} successfully`,
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// delete product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = router;
