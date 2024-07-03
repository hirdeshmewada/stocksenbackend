const Sales = require("../models/sales");
const soldStock = require("../controller/soldStock");

const getMonthlySales = async (req, res) => {
  if (req?.LLM === true) {
    try {
      const sales = await Sales.find();

      // Initialize array with 12 zeros
      const salesAmount = [];
      salesAmount.length = 12;
      salesAmount.fill(0);

      sales.forEach((sale) => {
        const monthIndex = parseInt(sale.SaleDate.split("-")[1]) - 1;
        salesAmount[monthIndex] += sale.TotalSaleAmount;
      });

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

    sales.forEach((sale) => {
      const monthIndex = parseInt(sale.SaleDate.split("-")[1]) - 1;
      salesAmount[monthIndex] += sale.TotalSaleAmount;
    });

    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Error fetching monthly sales: ${err.message}` });
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
    res.status(500).send(`Error calculating total sales amount: ${err.message}`);
  }
};

const getSalesData = async (req, res) => {
  if (req?.LLM === true) {
    try {
      const findAllSalesData = await Sales.find({ userID: req?.params?.userID })
        .sort({ _id: -1 })
        .populate("ProductID")
        .populate("StoreID");

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
      .populate("ProductID")
      .populate("StoreID");

    res.status(200).json(findAllSalesData);
  } catch (err) {
    res.status(500).send(`Error fetching sales data: ${err.message}`);
  }
};

const addSales = async (req, res) => {
  const { userID, productID, storeID, stockSold, saleDate, totalSaleAmount } = req.body;

  if (req?.LLM === true) {
    try {
      const addSale = new Sales({
        userID,
        ProductID: productID,
        StoreID: storeID,
        StockSold: stockSold,
        SaleDate: saleDate,
        TotalSaleAmount: totalSaleAmount,
      });

      const result = await addSale.save();
      await soldStock(productID, stockSold); // Assuming soldStock handles its own errors

      return result; // Return result if in LLM mode
    } catch (err) {
      console.error(err);
      return `Error adding sales: ${err.message}`; // Return error message if in LLM mode
    }
  }

  // Standard API mode
  try {
    const addSale = new Sales({
      userID,
      ProductID: productID,
      StoreID: storeID,
      StockSold: stockSold,
      SaleDate: saleDate,
      TotalSaleAmount: totalSaleAmount,
    });

    const result = await addSale.save();
    await soldStock(productID, stockSold);

    res.status(200).send(result);
  } catch (err) {
    res.status(402).send(err);
  }
};





module.exports = { addSales, getMonthlySales, getSalesData,  getTotalSalesAmount};
