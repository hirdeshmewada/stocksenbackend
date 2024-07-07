const Product = require("../models/product");
const Purchase = require("../models/purchase");
const mongoose = require("mongoose");
const generateDynamicPattern = require("../util/generateDynamicPattern");

// Add Purchase Details
const addPurchase = async (req, res) => {
  let { userID, purchasedProducts } = req.body;

  // If LLM mode is enabled, skip the res handling and return the result directly
  if (req?.LLM === true) {
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log(userID, purchasedProducts, new Date());
    try {
      let tempProducts = [];
      // Save the purchase transaction

      // Update stock for each product in the purchase
      for (const product of purchasedProducts) {
        const { productName, quantityPurchased } = product;
        console.log(
          "productName, quantityPurchased",
          productName,
          quantityPurchased
        );
        const myProductData = await Product.findOne({
          name: { $regex: generateDynamicPattern(productName) },
        }).session(session);
        console.log("myProductData", myProductData);
        if (!myProductData) {
          throw new Error("Product not found");
        }
        myProductData.stock =
          parseInt(myProductData.stock) + parseInt(quantityPurchased);
        let temp = {
          productID: myProductData._id,
          quantityPurchased: quantityPurchased,
          totalPurchaseAmount: quantityPurchased * myProductData.price,
        };

        tempProducts.push(temp);

        purchasedProducts = myProductData;

        await myProductData.save({ session });
      }

      const addPurchaseDetails = new Purchase({
        userID,
        purchasedProducts: tempProducts,
        purchaseDate: new Date(),
      });
      const savedPurchase = await addPurchaseDetails.save({ session });
      await session.commitTransaction();
      session.endSession();

      return savedPurchase; // Return result if in LLM mode
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      return error.message; // Return error message if in LLM mode
    }
  }

  // Normal mode
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const addPurchaseDetails = new Purchase({
      userID,
      purchasedProducts,
      purchaseDate,
    });

    // Save the purchase transaction
    const savedPurchase = await addPurchaseDetails.save({ session });

    // Update stock for each product in the purchase
    for (const product of purchasedProducts) {
      const { productID, quantityPurchased } = product;

      const myProductData = await Product.findOne({ _id: productID }).session(
        session
      );
      if (!myProductData) {
        throw new Error("Product not found");
      }
      myProductData.stock =
        parseInt(myProductData.stock) + parseInt(quantityPurchased);

      await myProductData.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).send(savedPurchase);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(402).send(error.message);
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
