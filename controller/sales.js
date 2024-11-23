const Sales = require("../models/sales");
const soldStock = require("../controller/soldStock");

const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const Store = require("../models/store");
const generateDynamicPattern = require("../util/generateDynamicPattern");

const getMonthlySales = async (req, res) => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999); // Set to end of day
  
  const startDate = new Date();
  startDate.setDate(currentDate.getDate() - 6); // Start date is 6 days before current date
  startDate.setHours(0, 0, 0, 0); // Set to start of day
  
  const userID = req.params.userID;

  if (req?.LLM === true) {
    try {
      const sales = await Sales.find({
        userID: userID,
        saleDate: {
          $gte: startDate,
          $lte: currentDate,
        },
      });

      const salesAmount = Array(7).fill(0);

      sales.forEach((sale) => {
        // Get the day difference and ensure it's within bounds
        const saleDate = new Date(sale.saleDate);
        saleDate.setHours(0, 0, 0, 0); // Normalize to start of day
        const dayDiff = Math.floor((saleDate - startDate) / (1000 * 60 * 60 * 24));
        
        if (dayDiff >= 0 && dayDiff < 7) {
          sale.soldProducts.forEach((product) => {
            salesAmount[dayDiff] += product.totalSaleAmount;
          });
        }
      });

      return salesAmount;
    } catch (err) {
      console.error(err);
      return `Error fetching daily sales: ${err.message}`;
    }
  }

  // Standard API mode
  try {
    const sales = await Sales.find({
      userID: userID,
      saleDate: {
        $gte: startDate,
        $lte: currentDate,
      },
    });

    const salesAmount = Array(7).fill(0);

    sales.forEach((sale) => {
      const dayIndex = Math.floor(
        (new Date(sale.saleDate) - startDate) / (1000 * 60 * 60 * 24)
      );
      sale.soldProducts.forEach((product) => {
        salesAmount[dayIndex] += product.totalSaleAmount;
      });
    });

    res.status(200).json(salesAmount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Error fetching daily sales: ${err.message}` });
  }
};

const getTotalSalesAmount = async (req, res) => {
  if (req?.LLM === true) {
    try {
      let totalSaleAmount = 0;
      const salesData = await Sales.find({ userID: req?.params?.userID });
      salesData.forEach((sale) => {
        sale.soldProducts.forEach((product) => {
          totalSaleAmount += product.totalSaleAmount;
        });
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
      sale.soldProducts.forEach((product) => {
        console.log("product", product);
        totalSaleAmount += product.totalSaleAmount;
      });
    });
    console.log("salesData", salesData);
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
        const myProductData = await Product.findOne(
          { $text: { $search: productName } },
          { score: { $meta: "textScore" } }
        )
          .sort({ score: { $meta: "textScore" } })
          .session(session);
        console.log(myProductData);
        if (!myProductData) {
          return { succes: true, data: "Product not found" };

          // throw new Error("Product not found");
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

      const storeID = await Store.findOne(
        { $text: { $search: storeName } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
      if (!storeID) {
        return { succes: true, data: "Store not found" };
        // throw new Error("store dont exit");
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
      if (!savedSales) {
        return {
          succes: true,
          data: "Sorry, can not create sales for this product. please try another",
        };

        // throw new Error("store dont exit");
      }

      return savedSales;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      return {
        succes: true,
        data: "Sorry, can not create sales for this product. please try another",
      };
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
      console.log(req.body);
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
