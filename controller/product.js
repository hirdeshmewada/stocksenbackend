const Product = require("../models/product");
const Purchase = require("../models/purchase");
const Sales = require("../models/sales");
const generateDynamicPattern = require("../util/generateDynamicPattern");

// Add Post
const addProduct = async (req, res) => {
  try {
    // Check if LLM mode is enabled
    console.log("is llm", req.LLM);
    console.log(req.body);
    if (req.LLM === true) {
      if (!req?.body?.userId) {
        return "User ID is required"; // Return message if in LLM mode
      }
      const newProduct = new Product({
        userID: req?.body?.userId,
        name: req?.body?.name,
        manufacturer: req?.body?.manufacturer,
        stock: req?.body?.stock,
        description: req?.body?.description,
        price: req?.body?.price,
      });
      const result = await newProduct.save();
      return result; // Return result if in LLM mode
    }

    // Normal mode
    const newProduct = new Product({
      userID: req?.body?.userId,
      name: req?.body?.name,
      manufacturer: req?.body?.manufacturer,
      stock: req?.body?.quantity,
      description: req?.body?.description,
      price: req?.body?.price,
    });

    newProduct
      .save()
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(402).send(err));
  } catch (error) {
    console.error("Error adding product: ", error);
    res.status(500).send("Server error");
  }
};

const getProductByName = async (req, res) => {
  try {
    // Check if LLM mode is enabled

    if (req.LLM === true) {
      // const productName = generateDynamicPattern(req?.params?.name)

      const productName = req?.params?.name;

      console.log(productName);
      const product = await Product.findOne(
        { $text: { $search: productName } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });

      console.log(product);
      if (!product) {
        return "Product not found"; // Return message if in LLM mode
      }
      return product; // Return product if in LLM mode
    }

    // Normal mode
    const productName = req?.params?.name.toLowerCase();
    const product = await Product.findOne({ name: productName });

    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by name: ", error);
    res.status(500).send("Server error");
  }
};

const getAllProducts = async (req, res) => {
  try {
    if (req?.LLM === true) {
      const findAllProducts = await Product.find({
        userID: req?.params?.userId,
      }).sort({ _id: -1 });
      return findAllProducts; // Return result if in LLM mode
    }

    // Normal mode
    const findAllProducts = await Product.find({
      userID: req?.params?.userId,
    }).sort({ _id: -1 });
    res.json(findAllProducts);
  } catch (error) {
    console.error("Error fetching all products: ", error);
    res.status(500).send("Server error");
  }
};

const deleteSelectedProduct = async (req, res) => {
  try {
    if (req.LLM === true) {
      const productName = generateDynamicPattern(req?.params?.name);

      const deleteProduct = await Product.deleteOne(  { $text: { $search: productName } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
      console.log("req.LLM", req.LLM, "deleteProduct", deleteProduct);
      // const deletePurchaseProduct = await Purchase.deleteOne({ ProductID: req?.params?.id });
      // const deleteSaleProduct = await Sales.deleteOne({ ProductID: req?.params?.id });
      return { deleteProduct }; // Return result if in LLM mode
    }

    // Normal mode
    const deleteProduct = await Product.deleteOne({ _id: req?.params?.id });
    const deletePurchaseProduct = await Purchase.deleteOne({
      ProductID: req?.params?.id,
    });
    const deleteSaleProduct = await Sales.deleteOne({
      ProductID: req?.params?.id,
    });
    res.json({ deleteProduct, deletePurchaseProduct, deleteSaleProduct });
  } catch (error) {
    console.error("Error deleting selected product: ", error);
    res.status(500).send("Server error");
  }
};

const updateSelectedProduct = async (req, res) => {
  try {
    const updateFields = {};
    const allowedFields = [
      "name",
      "manufacturer",
      "description",
      "price",
      "stock",
    ];

    // Populate updateFields only with the fields present in req.body
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });
    console.log("updateFields", updateFields);

    // Check if LLM mode is enabled
    if (req.LLM === true) {
      const productName = req?.params?.name

      const updatedResult = await Product.findOneAndUpdate(
        { $text: { $search: productName } },
        updateFields,
        {
          new: true,
          sort: { score: { $meta: "textScore" } },
          projection: { score: { $meta: "textScore" } }
        }
      );
      console.log("updatedResult", updatedResult);
      return updatedResult; // Return result if in LLM mode
    }

    // Normal mode
    const updatedResult = await Product.findByIdAndUpdate(
      { _id: req?.body?.productID },
      updateFields,
      { new: true }
    );
    res.json(updatedResult);
  } catch (error) {
    // console.error("Error updating selected product: ", error);
    console.log(error)
    res.status(500).send("Server error");
  }
};

const searchProduct = async (req, res) => {
  try {
    if (req.LLM === true) {
      const searchTerm = generateDynamicPattern(req?.query?.searchTerm);

      const products = await Product.find(
        {
          name: { $regex: searchTerm },
        },
        "name manufacturer price"
      );
      return products; // Return result if in LLM mode
    }

    // Normal mode
    const searchTerm = req?.query?.searchTerm;
    const products = await Product.find(
      {
        name: { $regex: searchTerm, $options: "i" },
      },
      "name manufacturer price"
    );
    res.json(products);
  } catch (error) {
    console.error("Error searching for products: ", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteSelectedProduct,
  updateSelectedProduct,
  searchProduct,
  getProductByName,
};
