const express = require("express");
const app = express();
const product = require("../controller/product");
const { upload } = require("../middleware/multer.middleware");
// Add Product
app.post("/add", 
    upload.fields(
       [ {
            name: "image",
            maxCount: 1
        },
    ]),
    product.addProduct);

// Get All Products
app.get("/get/:userId", product.getAllProducts);

// Delete Selected Product Item
app.get("/delete/:id", product.deleteSelectedProduct);

// Update Selected Product
app.post("/update", product.updateSelectedProduct);

// Search Product
app.get("/search", product.searchProduct);

//get product by name
app.get("/:name", product.getProductByName);

// http://localhost:4000/api/product/search?searchTerm=fa

module.exports = app;
