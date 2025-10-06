const { GoogleGenerativeAI } = require("@google/generative-ai");
// const { decrementCounter } = require("../services/decrementCounter");
// const { incrementCounter } = require("../services/incrementCounter");
// const { getCurrentProductNumber } = require("../services/getProductNumber");
const {
  increaseInventory,
  decreaseInventory,
  getInventory,
  createProduct,
  updateProductPrice,
  getProductPrice,
} = require("../services/inventoryManagement");
const {
  addPurchaseFunctionDeclaration,
  getPurchaseDataFunctionDeclaration,
  getTotalPurchaseAmountFunctionDeclaration,
  purchaseStockFunctionDeclaration,
  addSalesFunctionDeclaration,
  getSalesDataFunctionDeclaration,
  getTotalSalesAmountFunctionDeclaration,
  soldStockFunctionDeclaration,
  addStoreFunctionDeclaration,
  getAllStoresFunctionDeclaration,
  addProductFunctionDeclaration,
  getAllProductsFunctionDeclaration,
  deleteSelectedProductFunctionDeclaration,
  updateSelectedProductFunctionDeclaration,
  getProductByNameFunctionDeclaration,
  ErrorResponseFunctionDeclaration,
} = require("../Declaration");
const {
  updateMultipleInventories,
} = require("../services/updateMultipleInventories");
const {
  addPurchase,
  getPurchaseData,
  getTotalPurchaseAmount,
} = require("./purchase");
const purchaseStock = require("./purchaseStock");
const {
  addSales,
  getSalesData,
  getTotalSalesAmount,
  getMonthlySales,
} = require("./sales");
const soldStock = require("./soldStock");
const { addStore, getAllStores } = require("./store");
const {
  getProductByName,
  addProduct,
  getAllProducts,
  deleteSelectedProduct,
  updateSelectedProduct,
} = require("./product");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Existing function declarations

// New function declarations
// const createProductFunctionDeclaration = {
//   name: "createProduct",
//   parameters: {
//     type: "OBJECT",
//     description: "Create a new product in english",
//     properties: {
//       name: {
//         type: "STRING",
//         description: "Name of the product in english",
//       },
//       price: {
//         type: "NUMBER",
//         description: "Price of the product",
//       },
//       inventory: {
//         type: "NUMBER",
//         description: "Initial inventory value of the product",
//       },
//     },
//     required: ["name", "price"],
//   },
// };

// const increaseInventoryFunctionDeclaration = {
//   name: "increaseInventory",
//   parameters: {
//     type: "OBJECT",
//     description: "Increase the inventory of a product",
//     properties: {
//       name: {
//         type: "STRING",
//         description: "Name of the product in english",
//       },
//       quantity: {
//         type: "NUMBER",
//         description: "Quantity to increase",
//       },
//     },
//     required: ["name", "quantity"],
//   },
// };

// const decreaseInventoryFunctionDeclaration = {
//   name: "decreaseInventory",
//   parameters: {
//     type: "OBJECT",
//     description: "Decrease the inventory of a product",
//     properties: {
//       name: {
//         type: "STRING",
//         description: "Name of the product in english",
//       },
//       quantity: {
//         type: "NUMBER",
//         description: "Quantity to decrease",
//       },
//     },
//     required: ["name", "quantity"],
//   },
// };

// const getInventoryFunctionDeclaration = {
//   name: "getInventory",
//   parameters: {
//     type: "OBJECT",
//     description: "Get the current inventory of a product",
//     properties: {
//       name: {
//         type: "STRING",
//         description: "Name of the product in english",
//       },
//     },
//     required: ["name"],
//   },
// };

// const updateProductPriceFunctionDeclaration = {
//   name: "updateProductPrice",
//   parameters: {
//     type: "OBJECT",
//     description: "Update the price of a product",
//     properties: {
//       name: {
//         type: "STRING",
//         description: "Name of the product in english",
//       },
//       newPrice: {
//         type: "NUMBER",
//         description: "New price of the product",
//       },
//     },
//     required: ["name", "newPrice"],
//   },
// };
// const getProductPriceFunctionDeclaration = {
//   name: "getProductPrice",
//   parameters: {
//     type: "object",
//     description: "Retrieve the price of a specified product by its name in english",
//     properties: {
//       productName: {
//         type: "string",
//         description: "The name of the product in english if its a fruit give its english name",
//       },
//     },
//     required: ["productName"],
//   },
// };

// const functions = {
//   createProduct: ({ name, price, inventory }) => {
//     console.log("createProduct")
//     return createProduct(name, price, inventory);
//   },
//   increaseInventory: ({ name, quantity }) => {
//     console.log("increaseInventory")

//     return increaseInventory(name, quantity);
//   },
//   decreaseInventory: ({ name, quantity }) => {
//     console.log("decreaseInventory")

//     return decreaseInventory(name, quantity);
//   },
//   getInventory: ({ name }) => {
//     console.log("getInventory")

//     return getInventory(name);
//   },
//   updateProductPrice: ({ name, newPrice }) => {
//     console.log("updateProductPrice")

//     return updateProductPrice(name, newPrice);
//   },
//   getProductPrice: ({ productName }) => {
//     console.log("getProductPrice")

//     return getProductPrice(productName);
//   },
// };

const functions = {
  addProduct: async (req, res) => {
    console.log("addProduct");
    return addProduct(req, res);
  },

  getAllProducts: async ({ userID }) => {
    console.log("getAllProducts");
    return getAllProducts({ userID });
  },

  deleteSelectedProduct: async (req, res) => {
    console.log("deleteSelectedProduct");
    return deleteSelectedProduct(req, res);
  },

  updateSelectedProduct: async (req, res) => {
    console.log("updateSelectedProduct");
    return updateSelectedProduct(req, res);
  },

  addPurchase: async (req, res) => {
    console.log("addPurchase");
    return addPurchase(req, res);
  },

  getPurchaseData: async (req, res) => {
    console.log("getPurchaseData");
    return getPurchaseData(req, res);
  },

  getTotalPurchaseAmount: async (req, res) => {
    console.log("getTotalPurchaseAmount");
    return getTotalPurchaseAmount(req, res);
  },

  purchaseStock: async (req, res) => {
    console.log("purchaseStock");
    return purchaseStock(req, res);
  },

  addSales: async (req, res) => {
    console.log("addSales");
    return addSales(req, res);
  },

  // getSalesData: async (req,res) => {
  //   console.log("getSalesData");
  //   return getSalesData(req,res);
  // },

  // getTotalSalesAmount: async (req,res) => {
  //   console.log("getTotalSalesAmount");
  //   return getTotalSalesAmount(req,res);
  // },

  // soldStock: async (req,res) => {
  //   console.log("soldStock");
  //   return soldStock(req,res);
  // },

  // addStore: async (req,res) => {
  //   console.log("addStore");
  //   return addStore(req,res);
  // },

  // getAllStores: async (req,res) => {
  //   console.log("getAllStores");
  //   return getAllStores(req,res);
  // },
  getProductByName: async (req, res) => {
    console.log("getProductByName");
    return getProductByName(req, res);
  },
  ErrorResponse: async (req, res) => {
    console.log("error response");

    const ErrorResponse = (req, res) => {
      return {
        succes: true,
        data: "Sorry i can not full fill these types of request",
      };
    };
    return ErrorResponse(req, res);
  },
};
const ErrorResponse = (req, res) => {
  console.log("error happend");
  return {
    succes: true,
    data: "Sorry i can not full fill these types of request",
  };
};
const generativeModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  tools: {
    functionDeclarations: [
      addPurchaseFunctionDeclaration,
      addProductFunctionDeclaration,
      addSalesFunctionDeclaration,
      updateSelectedProductFunctionDeclaration,
      getProductByNameFunctionDeclaration,
      ErrorResponseFunctionDeclaration,
      // getPurchaseDataFunctionDeclaration,
      // getTotalPurchaseAmountFunctionDeclaration,
      // purchaseStockFunctionDeclaration,
      // getSalesDataFunctionDeclaration,
      // getTotalSalesAmountFunctionDeclaration,
      // soldStockFunctionDeclaration,
      // addStoreFunctionDeclaration,
      // getAllStoresFunctionDeclaration,
      // getAllProductsFunctionDeclaration,
      // deleteSelectedProductFunctionDeclaration,
    ],
  },
});

const handleGeminiRequest = async (req, res) => {
  try {
    console.log("Received request at /api/gemini/");
    console.log("Request body:", req.body);

    const { query } = req.body;
    if (!query) {
      console.log("Query is missing in the request body");
      return res.status(400).json({ error: "Query is required" });
    }

    const chat = generativeModel.startChat();
    const result = await chat.sendMessage(query);
    console.log("Query sent to generative model:", query);

    let call = "";
    try {
      call = result?.response?.functionCalls()[0];
    } catch (error) {
      console.log("Error extracting function call from response:", error);
    }

    let Error = "Sorry i can not full fill these types of request";
    console.log("Function call extracted:", call);

    req.params = call?.args;
    req.body = call?.args;
    req.LLM = true;

    if (!call) {
      console.log("No function calls found in the response");
      const result2 = await chat.sendMessage(`Always respond with an answer.
          You are a polite assistant who will professionally explain the error below.
          '''
          ${Error}
          '''
       `);
      try {
        let message = result2?.response?.text();
        console.log("Response message:", message);
        if (message) {
          res.status(200).json({
            message: result2.response.text(),
          });
        } else {
          res.status(200).json({
            message: "Sorry i can not full fill these types of request",
          });
        }
      } catch (error) {
        console.log("Error sending follow-up message:", error);
        res.status(200).json({
          message: "Sorry i can not full fill these types of request",
        });
      }
    }

    if (call) {
      console.log("Processing function call:", call.name);
      const apiResponse = await functions[call.name](req, res);
      console.log("API response:", apiResponse);

      const result2 = await chat.sendMessage(
        [
          {
            functionResponse: {
              name: call?.name || ErrorResponse(),
              response: apiResponse,
            },
          },
        ],
        `You are a polite female assistant who reads the tasks needed to be done and completes them.
         If the user asks to create a product, provide basic product information.
         If the user asks to add sales, create it and tell the user about the products added with their quantity.
         If the user asks to add purchases, create it and tell basic information about the products added with their quantity.
         never tell user about there userId
      `
      );
      console.log("Final response message:", result2.response.text());
      res.status(200).json({ message: result2.response.text() });
    }
  } catch (error) {
    console.log("Server error:", error);
    res.status(500).json({ error: "server Error please try again" });
  }
};

//used temp prompt

// if a user tell you to add stock you will create it and tell the user about the products that were added with there quantity.
// if a user tell you to sell stock you will create it and tell the user about the products that were sold with there quantity.
// if a user tell you to add store you will create it and tell the user about the store that was added.
// if a user tell you to get all stores you will give them all the stores that are present.
// if a user tell you to get all products you will give them all the products that are present.
// if a user tell you to delete a product you will delete it and tell the user about the product that was deleted.
// if a user tell you to update a product you will update it and tell the user about the product that was updated.
// if a user tell you to get the price of a product you will give them the price of the product.
// if a user tell you to update the price of a product you will update it and tell the user about the product that was updated.
// if a user tell you to get the inventory of a product you will give them the inventory of the product.
// if a user tell you to increase the inventory of a product you will increase it and tell the user about the product that was updated.
// if a user tell you to decrease the inventory of a product you will decrease it and tell the user about the product that was updated.

const updateInventories = async (req, res) => {
  try {
    const { data } = req.body;
    // console.log("reacttime data", typeof JSON.stringify(data), JSON.parse(JSON.stringify(data)) )
    const result = await updateMultipleInventories(data);
    if (result.success == true) {
      res.status(200).json({ message: "done" });
    } else {
      res.status(200).json({ message: "error" });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = { handleGeminiRequest, updateInventories };
