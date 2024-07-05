const express = require("express");

const { handleGeminiRequest } = require("../../controller/user/Product");

const app = express.Router();

app.post("/", handleGeminiRequest);
app.get("/test", (req,res)=>{
    res.status(200).send("working")
})


module.exports = app;
