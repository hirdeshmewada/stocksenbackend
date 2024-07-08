const addPurchaseFunctionDeclaration = {
  name: "addPurchase",
  parameters: {
    type: "OBJECT",
    description: "Add a new purchase transaction and update inventory",
    properties: {
      userID: {
        type: "STRING",
        description: "Unique identifier for the user making the purchase",
      },
      purchasedProducts: {
        type: "ARRAY",
        description: "List of products purchased",
        items: {
          type: "OBJECT",
          properties: {
            productName: {
              type: "STRING",
              description: "name of the purchased product in english",
            },
            quantityPurchased: {
              type: "NUMBER",
              description: "Quantity of the product purchased",
            },
          },
          required: ["productName"],
        },
      },
    },
    required: ["userID", "purchasedProducts"],
  },
};

const getPurchaseDataFunctionDeclaration = {
  name: "getPurchaseData",
  parameters: {
    type: "OBJECT",
    description: "Retrieve all purchase data for a specific user",
    properties: {
      userID: {
        type: "STRING",
        description:
          "Unique identifier for the user whose purchase data is to be retrieved",
      },
    },
    required: ["userID"],
  },
};

const getTotalPurchaseAmountFunctionDeclaration = {
  name: "getTotalPurchaseAmount",
  parameters: {
    type: "OBJECT",
    description:
      "Calculate the total amount spent on purchases by a specific user",
    properties: {
      userID: {
        type: "STRING",
        description:
          "Unique identifier for the user whose total purchase amount is to be calculated",
      },
    },
    required: ["userID"],
  },
};

const purchaseStockFunctionDeclaration = {
  name: "purchaseStock",
  parameters: {
    type: "OBJECT",
    description:
      "Update the stock level of a specific product based on purchased stock",
    properties: {
      productID: {
        type: "STRING",
        description:
          "Unique identifier for the product whose stock is being updated",
      },
      purchaseStockData: {
        type: "NUMBER",
        description:
          "Amount of stock to be added to the product's current stock",
      },
    },
    required: ["productID", "purchaseStockData"],
  },
};

const addSalesFunctionDeclaration = {
  name: "addSales",
  parameters: {
    type: "OBJECT",
    description: "Add a new sales record and update the stock sold for multiple products using given storen name and product names",
    properties: {
      userID: {
        type: "STRING",
        description: "Unique identifier for the user making the sale",
      },
      products: {
        type: "ARRAY",
        description: "Array of products being sold",
        items: {
          type: "OBJECT",
          properties: {
            productName: {
              type: "STRING",
              description: "english name for the product being sold",
            },
            stockSold: {
              type: "NUMBER",
              description: "Quantity of the product sold",
            },
          },
          required: ["productName","stockSold"],
        },
      },
      storeName: {
        type: "STRING",
        description: "name of the store where the sale occurred",
      },
    },
    required: ["userID", "products", "storeName"],
  },
};


const getSalesDataFunctionDeclaration = {
  name: "getSalesData",
  parameters: {
    type: "OBJECT",
    description: "Retrieve all sales data for a specific user",
    properties: {
      userID: {
        type: "STRING",
        description:
          "Unique identifier for the user whose sales data is to be retrieved",
      },
    },
    required: ["userID"],
  },
};

const getTotalSalesAmountFunctionDeclaration = {
  name: "getTotalSalesAmount",
  parameters: {
    type: "OBJECT",
    description: "Calculate the total sales amount for a specific user",
    properties: {
      userID: {
        type: "STRING",
        description:
          "Unique identifier for the user whose total sales amount is to be calculated",
      },
    },
    required: ["userID"],
  },
};

// const getMonthlySalesFunctionDeclaration = {
//   name: "getMonthlySales",
//   parameters: {
//     type: "OBJECT",
//     description: "Retrieve monthly sales amounts for all users",
//     properties: {},
//     required: [],
//   },
// };

const soldStockFunctionDeclaration = {
  name: "soldStock",
  parameters: {
    type: "OBJECT",
    description:
      "Update the stock level of a specific product based on the amount of stock sold",
    properties: {
      productID: {
        type: "STRING",
        description:
          "Unique identifier for the product whose stock is being updated",
      },
      stockSoldData: {
        type: "NUMBER",
        description:
          "Amount of stock that has been sold and should be deducted from the current stock",
      },
    },
    required: ["productID", "stockSoldData"],
  },
};

const addStoreFunctionDeclaration = {
  name: "addStore",
  parameters: {
    type: "OBJECT",
    description: "Add a new store to the database",
    properties: {
      userID: {
        type: "STRING",
        description: "Unique identifier for the user creating the store",
      },
      name: {
        type: "STRING",
        description: "Name of the store ",
      },
      category: {
        type: "STRING",
        description: "Category of the store (e.g., grocery, electronics)",
      },
      address: {
        type: "STRING",
        description: "Address of the store",
      },
      city: {
        type: "STRING",
        description: "City where the store is located",
      },
      image: {
        type: "STRING",
        description: "URL or path to the store's image",
      },
    },
    required: ["userID", "name", "category", "address", "city"],
  },
};

const getAllStoresFunctionDeclaration = {
  name: "getAllStores",
  parameters: {
    type: "OBJECT",
    description: "Retrieve all stores associated with a specific user",
    properties: {
      userID: {
        type: "STRING",
        description:
          "Unique identifier for the user whose stores are to be retrieved",
      },
    },
    required: ["userID"],
  },
};

const addProductFunctionDeclaration = {
  name: "addProduct",
  parameters: {
    type: "OBJECT",
    description: "Add a new product to the database",
    properties: {
      userId: {
        type: "STRING",
        description: "Unique identifier for the user adding the product",
      },
      name: {
        type: "STRING",
        description: "Name of the product in english",
      },
      manufacturer: {
        type: "STRING",
        description: "Manufacturer of the product",
      },
      stock: {
        type: "NUMBER",
        description: "Quantity of stock available for the product",
      },
      description: {
        type: "STRING",
        description: "Description of the product write in user given english",
      },
      price: {
        type: "NUMBER",
        description: "Price of the product",
      },
    },
    required: ["userId", "name", "manufacturer", "stock", "price"],
  },
};

const getAllProductsFunctionDeclaration = {
  name: "getAllProducts",
  parameters: {
    type: "OBJECT",
    description: "Retrieve all products for a specific user",
    properties: {
      userID: {
        type: "STRING",
        description:
          "Unique identifier for the user whose products are to be retrieved",
      },
    },
    required: ["userID"],
  },
};

const deleteSelectedProductFunctionDeclaration = {
  name: "deleteSelectedProduct",
  parameters: {
    type: "OBJECT",
    description: "Delete a specific product",
    properties: {
      name: {
        type: "STRING",
        description: "name of the product to be deleted in english",
      },
    },
    required: ["name"],
  },
};
const updateSelectedProductFunctionDeclaration = {
  name: "updateSelectedProduct",
  parameters: {
    type: "OBJECT",
    description: "Update details of a specific product",
    properties: {
      newName: {
        type: "STRING",
        description: "Updated name of the product",
      },
      name: {
        type: "STRING",
        description: "name of the product in english",
      },
      manufacturer: {
        type: "STRING",
        description: "Updated manufacturer of the product",
      },
      description: {
        type: "STRING",
        description: "Updated description of the product in same language user give ",
      },
      price: {
        type: "NUMBER",
        description: "Updated price of the product",
      },
      stock: {
        type: "NUMBER",
        description: "Updated stock quantity of the product",
      },
    },
    required: ["name"],
  },
};

const getProductByNameFunctionDeclaration = {
  name: "getProductByName",
  parameters: {
    type: "OBJECT",
    description: "Retrieve product information based on the product name",
    properties: {
      name: {
        type: "STRING",
        description:
          "Name of the product in english",
      },
    },
    required: ["name"],
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
  getAllStoresFunctionDeclaration, 
  addProductFunctionDeclaration,
  getAllProductsFunctionDeclaration,
  deleteSelectedProductFunctionDeclaration,
  updateSelectedProductFunctionDeclaration,
  getProductByNameFunctionDeclaration,
};
