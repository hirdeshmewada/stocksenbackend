const express = require("express");
const app = express();
const purchase = require("../controller/purchase");

// Add Purchase
app.post("/add/:userID", (req, res, next) => {
  const userID = req.params.userID;
  if (!userID) {
    return res.status(400).json({ error: "User ID is required" });
  }
  // Attach userID to request body
  req.body.userID = userID;
  next();
}, purchase.addPurchase);

// Get All Purchase Data
app.get("/get/:userID", purchase.getPurchaseData);

app.get("/get/:userID/totalpurchaseamount", purchase.getTotalPurchaseAmount);

module.exports = app;

// http://localhost:4000/api/purchase/add POST
// http://localhost:4000/api/purchase/get GET
