const Product = require("../models/product").default;

const purchaseStock = async (req, res) => {
  // Check if LLM mode is enabled
  const { productID, purchaseStockData } = req.body;

  if (req?.LLM === true) {
    try {
      const myProductData = await Product.findOne({ _id: productID });
      if (!myProductData) {
        return "Product not found"; // Handle case where product is not found
      }
      let myUpdatedStock = parseInt(myProductData.stock) + purchaseStockData;

      const updatedProduct = await Product.findByIdAndUpdate(
        { _id: productID },
        { stock: myUpdatedStock },
        { new: true }
      );

      return updatedProduct; // Return result if in LLM mode
    } catch (error) {
      console.error("Error updating purchase stock ", error);
      return `Error updating purchase stock: ${error.message}`; // Return error message if in LLM mode
    }
  }

  // Normal mode
  try {
    const myProductData = await Product.findOne({ _id: productID });
    if (!myProductData) {
      return res.status(404).send("Product not found"); // Handle case where product is not found
    }
    let myUpdatedStock = parseInt(myProductData.stock) + purchaseStockData;

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: productID },
      { stock: myUpdatedStock },
      { new: true }
    );

    console.log(updatedProduct);
    res.status(200).json(updatedProduct); // Send result in normal mode
  } catch (error) {
    console.error("Error updating purchase stock ", error);
    res.status(500).send(`Error updating purchase stock: ${error.message}`); // Send error message in normal mode
  }
};

module.exports = purchaseStock;
