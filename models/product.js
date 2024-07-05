const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: false,
    },
    stock: {
      type: Number,
      required: false,
    },
    description: String,
    price: {
      type: Number,
      required: false,
      min: [0, 'Price must be a positive number'], // Validation for price
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
