const Product = require("../models/product");
const Purchase = require("../models/purchase");
const Sales = require("../models/sales");
const { uploadOnCloudinary } = require("../util/cloudinary");
const generateDynamicPattern = require("../util/generateDynamicPattern");
const cloudinary = require('cloudinary').v2;

// Add Post
const addProduct = async (req, res) => {
  try {
    // Check for image in the request
    if (req?.files?.image && req?.files?.image[0]) {
      try {
        const file = req.files.image[0];
        const uploadedImage = await uploadOnCloudinary(file);
        
        if (uploadedImage && uploadedImage.url) {
          req.body.image = uploadedImage.url;
          console.log("Image uploaded successfully:", uploadedImage.url);
        } else {
          console.error("Image upload failed");
        }
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
      }
    } else {
      console.log("No image provided");
    }

    // Rest of your existing product creation logic
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
        image: req?.body?.image,
        ...req.body,
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
      image: req?.body?.image,
      ...req.body,
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

      try {
        const productName = req?.params?.name;

        console.log(productName);
        const product = await Product.findOne(
          { $text: { $search: productName } },
          { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });

        console.log(product);
        if (!product) {
          return { succes: true, data: "Product not found" }; // Return message if in LLM mode
        }
        return product; // Return product if in LLM mode
      } catch (error) {
        return { succes: true, data: "Product not found" }; // Return message if in LLM mode
      }
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

      // First find the product to get the image URL
      const product = await Product.findOne(
        { $text: { $search: productName } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });

      console.log("Found product:", product);

      // Delete image from Cloudinary if exists
      if (product?.image) {
        try {
          // Extract public ID from URL including folder path
          // Example: "http://res.cloudinary.com/drsccdxcf/image/upload/v1731771085/inventory-app/ncxto1xoxihyoc1zilmc.jpg"
          const urlParts = product.image.split('/');
          const fileName = urlParts[urlParts.length - 1]; // Get the filename
          const folder = urlParts[urlParts.length - 2];   // Get the folder name
          const publicId = `${folder}/${fileName.split('.')[0]}`; // Combine folder/filename without extension
          
          console.log("Image URL:", product.image);
          console.log("Extracted public ID:", publicId);
          
          const result = await cloudinary.uploader.destroy(publicId);
          console.log("Cloudinary deletion result:", result);
        } catch (cloudinaryError) {
          console.error("Error deleting image from Cloudinary:", cloudinaryError);
          console.error("Error details:", cloudinaryError.message);
        }
      } else {
        console.log("No image found for product");
      }

      const deleteProduct = await Product.deleteOne(
        { $text: { $search: productName } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });

      if (deleteProduct) {
        return { deleteProduct }; // Return result if in LLM mode
      }
      return { success: true, data: "cant find the product" };
    }

    // Normal mode
    // First find the product to get the image URL
    const product = await Product.findOne({ _id: req?.params?.id });
    console.log("Found product:", product);
    
    // Delete image from Cloudinary if exists
    if (product?.image) {
      try {
        // Extract public ID from URL including folder path
        // Example: "http://res.cloudinary.com/drsccdxcf/image/upload/v1731771085/inventory-app/ncxto1xoxihyoc1zilmc.jpg"
        const urlParts = product.image.split('/');
        const fileName = urlParts[urlParts.length - 1]; // Get the filename
        const folder = urlParts[urlParts.length - 2];   // Get the folder name
        const publicId = `${folder}/${fileName.split('.')[0]}`; // Combine folder/filename without extension
        
        console.log("Image URL:", product.image);
        console.log("Extracted public ID:", publicId);
        
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary deletion result:", result);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        console.error("Error details:", cloudinaryError.message);
      }
    } else {
      console.log("No image found for product");
    }

    // Only proceed with deletion if we found the product
    if (product) {
      const deleteProduct = await Product.deleteOne({ _id: req?.params?.id });
      const deletePurchaseProduct = await Purchase.deleteOne({
        ProductID: req?.params?.id,
      });
      const deleteSaleProduct = await Sales.deleteOne({
        ProductID: req?.params?.id,
      });
      res.json({ deleteProduct, deletePurchaseProduct, deleteSaleProduct });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
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
      try {
        const productName = req?.params?.name;

        const updatedResult = await Product.findOneAndUpdate(
          { $text: { $search: productName } },
          updateFields,
          {
            new: true,
            sort: { score: { $meta: "textScore" } },
            projection: { score: { $meta: "textScore" } },
          }
        );
        console.log("updatedResult", updatedResult);
        if (updatedResult) {
          return updatedResult; // Return result if in LLM mode
        }
        return { succes: true, data: "cant update the product" };
      } catch (error) {
        return { succes: true, data: "cant update the product" };
      }
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
    console.log(error);
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
