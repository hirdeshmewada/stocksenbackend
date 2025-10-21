const { GoogleGenerativeAI } = require("@google/generative-ai");
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
const { addSales, getSalesData, getTotalSalesAmount } = require("./sales");
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

// Function mapping - connects AI function calls to actual implementations
const functions = {
  // Product Management
  addProduct: async (req, res) => {
    console.log("addProduct called");
    return addProduct(req, res);
  },

  getAllProducts: async (req, res) => {
    console.log("getAllProducts called");
    return getAllProducts(req, res);
  },

  deleteSelectedProduct: async (req, res) => {
    console.log("deleteSelectedProduct called");
    return deleteSelectedProduct(req, res);
  },

  updateSelectedProduct: async (req, res) => {
    console.log("updateSelectedProduct called");
    return updateSelectedProduct(req, res);
  },

  getProductByName: async (req, res) => {
    console.log("getProductByName called");
    return getProductByName(req, res);
  },

  // Purchase Management
  addPurchase: async (req, res) => {
    console.log("addPurchase called");
    return addPurchase(req, res);
  },

  getPurchaseData: async (req, res) => {
    console.log("getPurchaseData called");
    return getPurchaseData(req, res);
  },

  getTotalPurchaseAmount: async (req, res) => {
    console.log("getTotalPurchaseAmount called");
    return getTotalPurchaseAmount(req, res);
  },

  purchaseStock: async (req, res) => {
    console.log("purchaseStock called");
    return purchaseStock(req, res);
  },

  // Sales Management
  addSales: async (req, res) => {
    console.log("addSales called");
    return addSales(req, res);
  },

  getSalesData: async (req, res) => {
    console.log("getSalesData called");
    return getSalesData(req, res);
  },

  getTotalSalesAmount: async (req, res) => {
    console.log("getTotalSalesAmount called");
    return getTotalSalesAmount(req, res);
  },

  soldStock: async (req, res) => {
    console.log("soldStock called");
    return soldStock(req, res);
  },

  // Store Management
  addStore: async (req, res) => {
    console.log("addStore called");
    return addStore(req, res);
  },

  getAllStores: async (req, res) => {
    console.log("getAllStores called");
    return getAllStores(req, res);
  },

  // Error Handler
  ErrorResponse: async (req, res) => {
    console.log("ErrorResponse called");
    return {
      success: true,
      data: "Sorry, I cannot fulfill this type of request",
    };
  },
};

// Initialize Gemini model with all available tools
const generativeModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  tools: {
    functionDeclarations: [
      // Product Operations
      addProductFunctionDeclaration,
      getAllProductsFunctionDeclaration,
      getProductByNameFunctionDeclaration,
      updateSelectedProductFunctionDeclaration,
      deleteSelectedProductFunctionDeclaration,

      // Purchase Operations
      addPurchaseFunctionDeclaration,
      getPurchaseDataFunctionDeclaration,
      getTotalPurchaseAmountFunctionDeclaration,
      purchaseStockFunctionDeclaration,

      // Sales Operations
      addSalesFunctionDeclaration,
      getSalesDataFunctionDeclaration,
      getTotalSalesAmountFunctionDeclaration,
      soldStockFunctionDeclaration,

      // Store Operations
      addStoreFunctionDeclaration,
      getAllStoresFunctionDeclaration,

      // Error Handler
      ErrorResponseFunctionDeclaration,
    ],
  },
  systemInstruction: `You are a flexible and intelligent inventory management assistant. Your primary goal is to help users manage their business inventory, even when their requests are vague, unclear, or in mixed languages.

YOUR CORE PHILOSOPHY:
🎯 ALWAYS TRY TO HELP - Interpret vague requests as inventory-related actions
🌍 BE FLEXIBLE - Accept product names in any language and convert to English
🤔 MAKE EDUCATED GUESSES - If unclear, choose the most likely inventory action
💬 ASK CLARIFYING QUESTIONS - Only when absolutely necessary

YOUR CAPABILITIES:
✓ Product Management: Add, view, update, delete products
✓ Sales Tracking: Record sales, view sales history, calculate total revenue
✓ Purchase Tracking: Record purchases, view purchase history, calculate total costs
✓ Store Management: Add stores, view all stores
✓ Inventory Queries: Check product details, stock levels, prices

HANDLING VAGUE OR UNCLEAR REQUESTS:
1. **Try to interpret as inventory action first** - Even if wording is unclear
2. **Look for keywords**: product names, numbers, action words (add, sell, buy, show, update)
3. **Make reasonable assumptions**: 
   - If user mentions a product name → probably wants to view/add it
   - If user mentions numbers + product → probably sales or purchase
   - If user asks about "quality" or "details" → show product information
4. **Convert non-English product names to English** automatically
5. **Only use ErrorResponse** for clearly non-inventory requests (weather, jokes, math, news)

EXAMPLES OF FLEXIBLE INTERPRETATION:
- "xp laptop quality" → Try getProductByName("laptop") or getAllProducts to show laptop details
- "सेब 10" → Interpret as apple, quantity 10 (could be sale or purchase, ask which)
- "banana price" → getProductByName("banana") to show price
- "sold some apples" → Ask "How many apples did you sell?"
- "bought stuff" → Ask "What products did you purchase and how many?"
- "show items" → getAllProducts
- "mango stock" → getProductByName("mango") to show stock level

IMPORTANT RULES:
1. Convert product names to English (e.g., "सेब" → "apple", "केला" → "banana")
2. Use singular form for products (e.g., "apples" → "apple")
3. Extract numbers as quantities
4. Never expose userId, productID, or technical details to users
5. Be conversational and helpful, not rigid

WHEN TO ASK FOR CLARIFICATION:
- User mentions quantity but unclear if sale or purchase
- Product name is too vague to identify
- Multiple possible interpretations exist

WHEN TO USE ErrorResponse:
ONLY for clearly non-inventory requests:
- Weather, news, current events
- Mathematical calculations unrelated to inventory
- Personal advice, jokes, entertainment
- Technical support for devices
- General knowledge questions

FUNCTION USAGE GUIDE:
📦 PRODUCTS:
- addProduct: Create new product (e.g., "add apple with price 50")
- getAllProducts: List all products (e.g., "show all products")
- getProductByName: Get specific product info (e.g., "show me apple details")
- updateSelectedProduct: Modify product (e.g., "change apple price to 60")
- deleteSelectedProduct: Remove product (e.g., "delete banana")

💰 SALES (Products going OUT to customers):
- addSales: Record sales (e.g., "I sold 10 apples to Main Store")
- getSalesData: View sales history (e.g., "show sales history")
- getTotalSalesAmount: Calculate revenue (e.g., "total sales amount")

📥 PURCHASES (Stock coming IN from suppliers):
- addPurchase: Record purchases (e.g., "I bought 50 apples")
- getPurchaseData: View purchase history (e.g., "show purchase history")
- getTotalPurchaseAmount: Calculate costs (e.g., "total purchase amount")

🏪 STORES:
- addStore: Register new store (e.g., "add store Main Street Market")
- getAllStores: List all stores (e.g., "show all stores")

RESPONSE STYLE:
- Always confirm actions taken with relevant details
- Be concise but informative
- Use friendly, professional language
- If something fails, explain why and suggest alternatives
- Never mention technical details like userID, productID, or function names to users`,
});

const handleGeminiRequest = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    console.log("User query:", query);
    const chat = generativeModel.startChat();
    const result = await chat.sendMessage(query);

    let call = null;
    try {
      const functionCalls = result?.response?.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        call = functionCalls[0];
      }
    } catch (error) {
      console.error("Error getting function calls:", error);
    }

    // If no function call was made, return a conversational response
    if (!call) {
      console.log(
        "No function call detected - returning conversational response"
      );
      try {
        const textResponse = result.response.text();
        return res.status(200).json({
          message:
            textResponse ||
            "I'm your inventory management assistant! I can help you:\n\n📦 Manage Products - Add, view, update, or delete products\n💰 Track Sales - Record sales and view revenue\n📥 Track Purchases - Record purchases and view costs\n🏪 Manage Stores - Add and view your stores\n\nWhat would you like to do?",
        });
      } catch (error) {
        console.error("Error getting text response:", error);
        return res.status(200).json({
          message:
            "I'm your inventory management assistant! I can help you:\n\n📦 Manage Products - Add, view, update, or delete products\n💰 Track Sales - Record sales and view revenue\n📥 Track Purchases - Record purchases and view costs\n🏪 Manage Stores - Add and view your stores\n\nWhat would you like to do?",
        });
      }
    }

    // Function call detected
    console.log("Function call detected:", call.name);
    console.log("Function arguments:", call.args);

    // Check if function exists
    if (!functions[call.name]) {
      console.error("Function not found:", call.name);
      return res.status(400).json({
        error: "Function not found",
        functionName: call.name,
      });
    }

    // Prepare request with function arguments
    req.params = call.args || {};
    req.body = call.args || {};
    req.LLM = true;

    // Execute the function
    let apiResponse;
    try {
      apiResponse = await functions[call.name](req, res);
      console.log("Function executed successfully:", call.name);
      console.log(
        "API Response:",
        JSON.stringify(apiResponse).substring(0, 200)
      );
    } catch (funcError) {
      console.error("Error executing function:", call.name, funcError);
      // If function execution fails, inform the AI about the error
      apiResponse = {
        success: false,
        error: "Function execution failed",
        message:
          funcError.message ||
          "An error occurred while processing your request",
      };
    }

    // Send function response back to model for natural language response
    const result2 = await chat.sendMessage([
      {
        functionResponse: {
          name: call.name,
          response: apiResponse,
        },
      },
    ]);

    const finalResponse = result2.response.text();
    console.log("Final response:", finalResponse);

    return res.status(200).json({ message: finalResponse });
  } catch (error) {
    console.error("Server error in handleGeminiRequest:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      error: "Server error, please try again",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const updateInventories = async (req, res) => {
  try {
    const { data } = req.body;
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
