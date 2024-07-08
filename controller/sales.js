const Sales = require("../models/sales");
const soldStock = require("../controller/soldStock");

const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const Store = require("../models/store");
const generateDynamicPattern = require("../util/generateDynamicPattern");

const getMonthlySales = async (req, res) => {
  if (req?.LLM === true) {
    try {
      const sales = await Sales.find();

      // Initialize array with 12 zeros
      const salesAmount = [];
      salesAmount.length = 12;
      salesAmount.fill(0);

      // sales.forEach((sale) => {
      //   const monthIndex = parseInt(sale?.SaleDate.split("-")[1]) - 1;
      //   salesAmount[monthIndex] += sale?.TotalSaleAmount;
      // });

      return { salesAmount }; // Return data if in LLM mode
    } catch (err) {
      console.error(err);
      return `Error fetching monthly sales: ${err.message}`; // Return error message if in LLM mode
    }
  }

  // Standard API mode
  try {
    const sales = await Sales.find();

    // Initialize array with 12 zeros
    const salesAmount = [];
    salesAmount.length = 12;
    salesAmount.fill(0);

    // sales.forEach((sale) => {
    //   const monthIndex = parseInt(sale?.SaleDate.split("-")[1]) - 1;
    //   salesAmount[monthIndex] += sale?.TotalSaleAmount;
    // });

    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: `Error fetching monthly sales: ${err.message}` });
  }
};

const getTotalSalesAmount = async (req, res) => {
  if (req?.LLM === true) {
    try {
      let totalSaleAmount = 0;
      const salesData = await Sales.find({ userID: req?.params?.userID });
      salesData.forEach((sale) => {
        totalSaleAmount += sale.TotalSaleAmount;
      });

      return { totalSaleAmount }; // Return data if in LLM mode
    } catch (err) {
      console.error(err);
      return `Error calculating total sales amount: ${err.message}`; // Return error message if in LLM mode
    }
  }

  // Standard API mode
  try {
    let totalSaleAmount = 0;
    const salesData = await Sales.find({ userID: req?.params?.userID });
    salesData.forEach((sale) => {
      totalSaleAmount += sale.TotalSaleAmount;
    });

    res.status(200).json({ totalSaleAmount });
  } catch (err) {
    res
      .status(500)
      .send(`Error calculating total sales amount: ${err.message}`);
  }
};
const addSales = async (req, res) => {
  const { userID, products, storeName, saleDate } = req.body;
  console.log("products", JSON.stringify(products));
  const session = await mongoose.startSession();
  session.startTransaction();

  if (req.LLM === true) {
    // Logic when LLM is true
    try {
      let tempProducts = [];
      let totalSaleAmount = 0;

      for (const product of products) {
        const { productName, stockSold } = product;
        const myProductData = await Product.findOne({
          name: { $in: generateDynamicPattern(productName) },
        }).session(session);
        console.log(myProductData);
        if (!myProductData) {
          throw new Error("Product not found");
        }

        myProductData.stock =
          parseInt(myProductData.stock) - parseInt(stockSold);
        let temp = {
          productID: myProductData._id,
          quantitySold: parseInt(stockSold),
          totalSaleAmount: parseInt(stockSold) * myProductData.price,
        };
        totalSaleAmount += parseInt(stockSold) * myProductData.price;
        tempProducts.push(temp);

        await myProductData.save({ session });
      }

      const storeID = await Store.findOne({
        name: { $in: generateDynamicPattern(storeName) },
      });
      if (!storeID) {
        return "store dont exit";
      }
      const addSalesDetails = new Sales({
        userID,
        soldProducts: tempProducts,
        storeID: storeID?._id,
        saleDate: new Date(),
        totalSaleAmount: totalSaleAmount,
      });

      const savedSales = await addSalesDetails.save({ session });
      await session.commitTransaction();
      session.endSession();

      return savedSales;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      return error.message;
    }
  } else {
    // Logic when LLM is false
    try {
      let tempProducts = [];
      let totalSaleAmount = 0;
      for (const product of products) {
        const { productID, stockSold } = product;
        const myProductData = await Product.findOne({ _id: productID }).session(
          session
        );

        if (!myProductData) {
          throw new Error("Product not found");
        }

        myProductData.stock =
          parseInt(myProductData.stock) - parseInt(stockSold);
        let temp = {
          productID: myProductData._id,
          quantitySold: parseInt(stockSold),
          totalSaleAmount: parseInt(stockSold) * myProductData.price,
        };
        totalSaleAmount += parseInt(stockSold) * myProductData.price;
        tempProducts.push(temp);

        await myProductData.save({ session });
      }

      // const storeID = await Sales.findById(req.params.storeID);
      // if (!storeID) {
      //   return "store dont exit";
      // }
      console.log(req.body)
      const addSalesDetails = new Sales({
        userID,
        soldProducts: tempProducts,
        storeID: req?.body?.storeID,
        saleDate: new Date(saleDate),
        totalSaleAmount: totalSaleAmount,
      });

      const savedSales = await addSalesDetails.save({ session });
      await session.commitTransaction();
      session.endSession();

      res.status(200).send(savedSales);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      res.status(402).send(error.message);
    }
  }
};

const getSalesData = async (req, res) => {
  if (req?.LLM === true) {
    try {
      const findAllSalesData = await Sales.find({
        userID: req?.params?.userID,
      }).sort({ _id: -1 });
      // .populate("soldProducts.productID")
      // .populate("storeID");

      return findAllSalesData; // Return data if in LLM mode
    } catch (err) {
      console.error(err);
      return `Error fetching sales data: ${err.message}`; // Return error message if in LLM mode
    }
  }

  // Standard API mode
  try {
    const findAllSalesData = await Sales.find({ userID: req?.params?.userID })
      .sort({ _id: -1 })
      .populate("soldProducts.productID")
      .populate("storeID");

    res.status(200).json(findAllSalesData);
  } catch (err) {
    res.status(500).send(`Error fetching sales data: ${err.message}`);
  }
};

module.exports = {
  addSales,
  getMonthlySales,
  getSalesData,
  getTotalSalesAmount,
};
