const express = require("express");
const app = express();
const sales = require("../controller/sales");

// Add Sales - Updated to include userID validation
app.post("/add/:userID", (req, res, next) => {
  const userID = req.params.userID;
  if (!userID) {
    return res.status(400).json({ error: "User ID is required" });
  }
  // Attach userID to request body
  req.body.userID = userID;
  next();
}, sales.addSales);

// Get All Sales
app.get("/get/:userID", sales.getSalesData);
app.get("/getmonthly/:userID", sales.getMonthlySales);


app.get("/get/:userID/totalsaleamount", sales.getTotalSalesAmount);

module.exports = app;



// http://localhost:4000/api/sales/add POST
// http://localhost:4000/api/sales/get GET
