const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["Youth", "Illustrations", "Grocery Products", "Others"],
      required: [true, "Product type is required"],
    },
    stock: {
      type: Number,
      required: [true, "Quantity of stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    mrp: {
      type: Number,
      required: [true, "MRP is required"],
      min: [0, "MRP cannot be negative"],
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price cannot be negative"],
      min: [0, "Selling price cannot be negative"],
    },
    brandName: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    exchangeOrReturn: {
      type: String,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model('Product',productSchema)