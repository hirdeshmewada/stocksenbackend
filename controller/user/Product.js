const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  addPurchaseFunctionDeclaration,
} = require("../../Declaration/user/index");
const { addSales } = require("../sales");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const functions = {
  // addProduct: async (req,res) => {
  //   console.log("addProduct");
  //   return addProduct(req,res);
  // },

  // getAllProducts: async ({ userID }) => {
  //   console.log("getAllProducts");
  //   return getAllProducts({ userID });
  // },

  // deleteSelectedProduct: async (req,res) => {
  //   console.log("deleteSelectedProduct");
  //   return deleteSelectedProduct(req,res);
  // },

  // updateSelectedProduct: async (req,res) => {
  //   console.log("updateSelectedProduct");
  //   return updateSelectedProduct(req,res);
  // },

  // addPurchase: async (req,res) => {
  //   console.log("addPurchase");
  //   return addPurchase(req,res);
  // },

  // getPurchaseData: async (req,res) => {
  //   console.log("getPurchaseData");
  //   return getPurchaseData(req,res);
  // },

  // getTotalPurchaseAmount: async (req,res) => {
  //   console.log("getTotalPurchaseAmount");
  //   return getTotalPurchaseAmount(req,res);
  // },

  // purchaseStock: async (req,res) => {
  //   console.log("purchaseStock");
  //   return purchaseStock(req,res);
  // },

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
  // getProductByName: async (req,res) => {
  //   console.log("getProductByName");
  //   return getProductByName(req,res);
  // },
};

const generativeModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  tools: {
    functionDeclarations: [addPurchaseFunctionDeclaration],
  },
});

const handleGeminiRequest = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    const chat = generativeModel.startChat();
    const result = await chat.sendMessage(query);
    console.log("query", query);
    const call = result.response.functionCalls()[0];
    console.log(call.args, "here is whole call", call);
    req.params = call.args;
    req.body = call.args;
    req.LLM = true;
    if (call) {
      const apiResponse = await functions[call.name](req, res);
      const result2 = await chat.sendMessage(
        [
          {
            functionResponse: {
              name: call.name,
              response: apiResponse,
            },
          },
        ],
        "always respond in the language user has used to give command and respond in non technical way"
      );
      res.status(200).json({ message: result2.response.text() });
    } else {
      res.status(200).json({ message: result.response.text() });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = { handleGeminiRequest };
