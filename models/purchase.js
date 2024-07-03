const mongoose = require("mongoose");

const PurchasedProductSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantityPurchased: {
    type: Number,
    required: false,
  },
  totalPurchaseAmount: {
    type: Number,
    required: false,
  },
});

const PurchaseSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    purchasedProducts: [PurchasedProductSchema],
    purchaseDate: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Purchase = mongoose.model("purchase", PurchaseSchema);
module.exports = Purchase;
