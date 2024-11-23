const Product = require("../models/product");
const Purchase = require("../models/purchase");
const mongoose = require("mongoose");
const generateDynamicPattern = require("../util/generateDynamicPattern");

// Add Purchase Details
const addPurchase = async (req, res) => {
  let { userID, purchaseDate, purchasedProducts } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const addPurchaseDetails = new Purchase({
      userID,
      purchasedProducts,
      purchaseDate: purchaseDate || new Date(),
    });

    // Save the purchase transaction
    const savedPurchase = await addPurchaseDetails.save({ session });

    // Update stock for each product in the purchase
    const bulkOps = [];
    for (const product of purchasedProducts) {
      const { productID, quantityPurchased } = product;

      const myProductData = await Product.findOne({ _id: productID }).session(session);
      if (!myProductData) {
        throw new Error(`Product not found with ID: ${productID}`);
      }
      
      const newStock = parseInt(myProductData.stock) + parseInt(quantityPurchased);
      
      bulkOps.push({
        updateOne: {
          filter: { _id: productID },
          update: { $set: { stock: newStock } }
        }
      });
    }

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps, { session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(savedPurchase);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Purchase error:', error);
    res.status(400).json({ error: error.message });
  }
};

const getPurchaseData = async (req, res) => {
  // Check if LLM mode is enabled
  if (req?.LLM === true) {
    const findAllPurchaseData = await Purchase.find({
      userID: req?.params?.userID,
    })
      .sort({ _id: -1 })
      .populate("purchasedProducts.productID"); // Populate product details
    return findAllPurchaseData; // Return result if in LLM mode
  }

  // Normal mode
  try {
    const findAllPurchaseData = await Purchase.find({
      userID: req?.params?.userID,
    })
      .sort({ _id: -1 })
      .populate("purchasedProducts.productID"); // Populate product details
    res.json(findAllPurchaseData);
  } catch (error) {
    console.error("Error fetching purchase data: ", error);
    res.status(500).send("Server error");
  }
};

const getTotalPurchaseAmount = async (req, res) => {
  // Check if LLM mode is enabled
  if (req?.LLM === true) {
    let totalPurchaseAmount = 0;
    const purchaseData = await Purchase.find({ userID: req?.params?.userID });
    purchaseData.forEach((purchase) => {
      purchase.purchasedProducts.forEach((product) => {
        totalPurchaseAmount += product.totalPurchaseAmount;
      });
    });
    return { totalPurchaseAmount }; // Return result if in LLM mode
  }

  // Normal mode
  try {
    let totalPurchaseAmount = 0;
    const purchaseData = await Purchase.find({ userID: req?.params?.userID });
    purchaseData.forEach((purchase) => {
      purchase.purchasedProducts.forEach((product) => {
        totalPurchaseAmount += product.totalPurchaseAmount;
      });
    });
    res.json({ totalPurchaseAmount });
  } catch (error) {
    console.error("Error fetching total purchase amount: ", error);
    res.status(500).send("Server error");
  }
};

module.exports = { addPurchase, getPurchaseData, getTotalPurchaseAmount };
