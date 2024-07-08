const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    
    soldProducts: [
      {
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantitySold: {
          type: Number,
          required: false,
        },
        totalSaleAmount: {
          type: Number,
          required: false,
        },
      },
    ],
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
      required: true,
    },
    saleDate: {
      type: Date,
      required: false,
    },
    totalSaleAmount: {
      type: Number,
      required: false,
    },
    
  },
  { timestamps: true }
);

const Sales = mongoose.model("sales", SaleSchema);
module.exports = Sales;
