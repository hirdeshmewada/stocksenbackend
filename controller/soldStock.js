const Sales = require("../models/sales");
const Product = require("../models/product").default;

const soldStock = async (productID, stockSoldData, req = null) => {
  // If req.LLM is provided and true, handle LLM mode
  if (req?.LLM === true) {
    try {
      const myProductData = await Product.findOne({ _id: productID });
      if (!myProductData) {
        throw new Error("Product not found");
      }
      let myUpdatedStock = myProductData.stock - stockSoldData;
      console.log("MY SOLD STOCK: ", myUpdatedStock);

      const SoldStock = await Product.findByIdAndUpdate(
        { _id: productID },
        { stock: myUpdatedStock },
        { new: true }
      );
      console.log(SoldStock);

      // Return the result or a message in LLM mode
      return SoldStock; // or a descriptive message if preferred
    } catch (error) {
      console.error("Error updating sold stock: ", error);
      // Return error message in LLM mode
      return `Error updating sold stock: ${error.message}`;
    }
  }

  // Standard API mode
  try {
    const myProductData = await Product.findOne({ _id: productID });
    if (!myProductData) {
      throw new Error("Product not found");
    }
    let myUpdatedStock = myProductData.stock - stockSoldData;
    console.log("MY SOLD STOCK: ", myUpdatedStock);

    const SoldStock = await Product.findByIdAndUpdate(
      { _id: productID },
      { stock: myUpdatedStock },
      { new: true }
    );
    console.log(SoldStock);
  } catch (error) {
    console.error("Error updating sold stock: ", error);
  }
};

module.exports = soldStock;
