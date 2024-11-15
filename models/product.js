const mongoose = require('mongoose');

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
      min: [0, 'Price must be a positive number'],
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

ProductSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('product', ProductSchema);
module.exports = Product;
