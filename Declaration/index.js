const addPurchaseFunctionDeclaration = {
  name: "addPurchase",
  description:
    "Record when the user BUYS or PURCHASES inventory/stock from suppliers. This INCREASES inventory. Use when user mentions: 'bought', 'purchased', 'got stock', 'received', 'restocked', 'added inventory'. Example: 'bought 50 apples', 'purchased bananas', 'got 30 oranges'. FLEXIBLE: Accept vague wording about getting/receiving products.",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description: "Unique identifier for the user making the purchase",
      },
      purchasedProducts: {
        type: "array",
        description: "List of products purchased from suppliers",
        items: {
          type: "object",
          properties: {
            productName: {
              type: "string",
              description:
                "Name of the product in English (singular form). Convert from any language. Extract from vague input.",
            },
            quantityPurchased: {
              type: "number",
              description:
                "Quantity purchased. Extract number from user input.",
            },
          },
          required: ["productName", "quantityPurchased"],
        },
      },
    },
    required: ["userID", "purchasedProducts"],
  },
};

const getPurchaseDataFunctionDeclaration = {
  name: "getPurchaseData",
  description:
    "Get complete history of all PURCHASES (stock bought from suppliers). Use when user asks: 'show purchase history', 'what did I buy', 'purchase records', 'show all purchases', 'what stock did I purchase'",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description:
          "Unique identifier for the user whose purchase data is to be retrieved",
      },
    },
    required: ["userID"],
  },
};

const getTotalPurchaseAmountFunctionDeclaration = {
  name: "getTotalPurchaseAmount",
  description:
    "Calculate the TOTAL MONEY spent on all purchases from suppliers. Use when user asks: 'how much did I spend on purchases', 'total purchase amount', 'what's my total purchase cost', 'how much money did I spend buying stock'",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description:
          "Unique identifier for the user whose total purchase amount is to be calculated",
      },
    },
    required: ["userID"],
  },
};

const purchaseStockFunctionDeclaration = {
  name: "purchaseStock",
  description:
    "Directly ADD stock quantity to a specific product by productID (low-level function). NOTE: Prefer using 'addPurchase' for recording purchase transactions. Only use this if you have the exact productID and just need to increase stock without creating a purchase record.",
  parameters: {
    type: "object",
    properties: {
      productID: {
        type: "string",
        description:
          "Unique database identifier (ID) for the product whose stock is being increased",
      },
      purchaseStockData: {
        type: "number",
        description:
          "Amount of stock to ADD to the product's current stock (must be positive)",
      },
    },
    required: ["productID", "purchaseStockData"],
  },
};

const addSalesFunctionDeclaration = {
  name: "addSales",
  description:
    "Record when the user SELLS products to customers. This DECREASES inventory. Use when user mentions: 'sold', 'sale', 'customer bought', or when user mentions product + quantity without clear context. Example: 'sold 10 apples', 'sale banana', '5 oranges'. FLEXIBLE: If unclear whether sale or purchase, prefer this. storeName defaults to 'General Store' if not provided.",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description: "Unique identifier for the user making the sale",
      },
      products: {
        type: "array",
        description: "Array of products being sold to customers",
        items: {
          type: "object",
          properties: {
            productName: {
              type: "string",
              description:
                "English name for the product (singular form). Convert from any language. Extract from vague input.",
            },
            stockSold: {
              type: "number",
              description: "Quantity sold. Extract number from user input.",
            },
          },
          required: ["productName", "stockSold"],
        },
      },
      storeName: {
        type: "string",
        description: "Store name. Default to 'General Store' if not mentioned.",
      },
    },
    required: ["userID", "products", "storeName"],
  },
};

const getSalesDataFunctionDeclaration = {
  name: "getSalesData",
  description:
    "Get complete history of all SALES (products sold to customers). Use when user asks: 'show sales history', 'what did I sell', 'sales records', 'show all sales', 'what products were sold'",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description:
          "Unique identifier for the user whose sales data is to be retrieved",
      },
    },
    required: ["userID"],
  },
};

const getTotalSalesAmountFunctionDeclaration = {
  name: "getTotalSalesAmount",
  description:
    "Calculate the TOTAL REVENUE/MONEY earned from all sales to customers. Use when user asks: 'how much did I earn', 'total sales amount', 'what's my total revenue', 'how much money did I make from sales', 'total sales revenue'",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description:
          "Unique identifier for the user whose total sales amount is to be calculated",
      },
    },
    required: ["userID"],
  },
};

const soldStockFunctionDeclaration = {
  name: "soldStock",
  description:
    "Directly SUBTRACT stock quantity from a specific product by productID (low-level function). NOTE: Prefer using 'addSales' for recording sales transactions. Only use this if you have the exact productID and just need to decrease stock without creating a sales record.",
  parameters: {
    type: "object",
    properties: {
      productID: {
        type: "string",
        description:
          "Unique database identifier (ID) for the product whose stock is being decreased",
      },
      stockSoldData: {
        type: "number",
        description:
          "Amount of stock to SUBTRACT from the product's current stock (must be positive)",
      },
    },
    required: ["productID", "stockSoldData"],
  },
};

const addStoreFunctionDeclaration = {
  name: "addStore",
  description:
    "Register a NEW store/shop location in the system. Use when user says: 'add store', 'create store', 'register new store', 'add shop'. Example: 'Add a store named Main Street Market in New York'. If category, address, or city not provided, use reasonable defaults or ask user.",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description: "Unique identifier for the user creating the store",
      },
      name: {
        type: "string",
        description: "Name of the store/shop",
      },
      category: {
        type: "string",
        description:
          "Category/type of the store (e.g., 'grocery', 'electronics', 'retail'). Default to 'General' if not specified",
      },
      address: {
        type: "string",
        description:
          "Physical address of the store. Use 'Not specified' if not provided",
      },
      city: {
        type: "string",
        description:
          "City where the store is located. Use 'Not specified' if not provided",
      },
      image: {
        type: "string",
        description: "URL or path to the store's image (optional)",
      },
    },
    required: ["userID", "name", "category", "address", "city"],
  },
};

const getAllStoresFunctionDeclaration = {
  name: "getAllStores",
  description:
    "Get a complete list of ALL stores/shops registered in the system. Use when user asks: 'show all stores', 'list stores', 'what stores do I have', 'show my stores', 'display all shops'",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description:
          "Unique identifier for the user whose stores are to be retrieved",
      },
    },
    required: ["userID"],
  },
};

const addProductFunctionDeclaration = {
  name: "addProduct",
  description:
    "Create a NEW product in the inventory system. Use when user says: 'add product', 'create product', 'new product', 'register product'. Example: 'Add a product named apple with price 50 and stock 100'. If manufacturer or description not provided, use reasonable defaults.",
  parameters: {
    type: "object",
    properties: {
      userId: {
        type: "string",
        description: "Unique identifier for the user adding the product",
      },
      name: {
        type: "string",
        description:
          "Name of the product in English, ALWAYS in singular form (e.g., 'apple' not 'apples', 'banana' not 'bananas')",
      },
      manufacturer: {
        type: "string",
        description:
          "Manufacturer or brand of the product. If not provided, use 'Generic' or 'Unknown'",
      },
      stock: {
        type: "number",
        description:
          "Initial quantity of stock available for the product (default to 0 if not specified)",
      },
      description: {
        type: "string",
        description:
          "Brief description of the product. If not provided, use product name as description",
      },
      price: {
        type: "number",
        description: "Price per unit of the product (must be positive number)",
      },
    },
    required: ["userId", "name", "manufacturer", "stock", "price"],
  },
};

const getAllProductsFunctionDeclaration = {
  name: "getAllProducts",
  description:
    "Get a complete list of ALL products in the user's inventory. Use when user says: 'show all products', 'list products', 'what products', 'show inventory', 'display items', 'products', 'items', 'show', 'list', or any vague request about viewing multiple products.",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description:
          "Unique identifier for the user whose products are to be retrieved",
      },
    },
    required: ["userID"],
  },
};

const deleteSelectedProductFunctionDeclaration = {
  name: "deleteSelectedProduct",
  description:
    "Permanently REMOVE a product from the inventory system. Use when user says: 'delete product', 'remove product', 'delete apple', 'remove banana from inventory'. WARNING: This cannot be undone.",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description:
          "Name of the product to be deleted in English (singular form)",
      },
    },
    required: ["name"],
  },
};

const updateSelectedProductFunctionDeclaration = {
  name: "updateSelectedProduct",
  description:
    "Modify/change details of an existing product (name, price, stock, manufacturer, description). Use when user says: 'update product', 'change price of', 'modify product', 'edit product', 'rename product'. Example: 'Change the price of apple to 60' or 'Update banana stock to 200'. Only include fields that need to be updated.",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description:
          "Current name of the product to update (in English, singular form)",
      },
      newName: {
        type: "string",
        description:
          "New name for the product (only if user wants to rename it)",
      },
      manufacturer: {
        type: "string",
        description: "Updated manufacturer (only if user wants to change it)",
      },
      description: {
        type: "string",
        description: "Updated description (only if user wants to change it)",
      },
      price: {
        type: "number",
        description: "New price per unit (only if user wants to change price)",
      },
      stock: {
        type: "number",
        description:
          "New stock quantity (only if user wants to set specific stock level)",
      },
    },
    required: ["name"],
  },
};

const getProductByNameFunctionDeclaration = {
  name: "getProductByName",
  description:
    "Search for and retrieve details of a SPECIFIC product by its name. Use when user mentions ANY product name even if query is vague or unclear: 'show me apple', 'banana price', 'mango stock', 'laptop quality', 'xp laptop', 'apple details', or just product name alone. FLEXIBLE: Try this function for any vague query that mentions a product name.",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description:
          "Name of the product in English (singular form). Extract product name from vague queries. Convert from other languages.",
      },
    },
    required: ["name"],
  },
};

const ErrorResponseFunctionDeclaration = {
  name: "ErrorResponse",
  description:
    "Use this function ONLY when the user's request cannot be fulfilled with any other available function. For example: requests for weather, jokes, math calculations, general knowledge, or anything not related to inventory management. This returns a polite message explaining you cannot help with that type of request.",
  parameters: {
    type: "object",
    properties: {
      userId: {
        type: "string",
        description: "User identifier (can be empty string if not available)",
      },
    },
    required: ["userId"],
  },
};

module.exports = {
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
};
