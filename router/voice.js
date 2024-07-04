const express = require("express");

const { handleGeminiRequest, updateInventories } = require("../controller/geminiFunctions");
// const { getAllProducts } = require("../services/getAllProducts");

const app = express.Router();

app.post("/", handleGeminiRequest);
app.post("/realtimeupdate", updateInventories);
app.get("/test", (req,res)=>{
    res.status(200).send("working")
})
// app.get("/allproducts", getAllProducts)
//
//


module.exports = app;
