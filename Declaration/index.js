const addPurchaseFunctionDeclaration = {
  name: "addPurchase",
  description: "Add a new purchase transaction and update inventory",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description: "Unique identifier for the user making the purchase"
      },
      purchasedProducts: {
        type: "array",
        description: "List of products purchased",
        items: {
          type: "object",
          properties: {
            productName: {
              type: "string",
              description: "Name of the purchased product in English"
            },
            quantityPurchased: {
              type: "number",
              description: "Quantity of the product purchased"
            }
          },
          required: ["productName", "quantityPurchased"]
        }
      }
    },
    required: ["userID", "purchasedProducts"]
  }
};

const getPurchaseDataFunctionDeclaration = {
  name: "getPurchaseData",
  description: "Retrieve all purchase data for a specific user",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description: "Unique identifier for the user whose purchase data is to be retrieved"
      }
    },
    required: ["userID"]
  }
};

const getTotalPurchaseAmountFunctionDeclaration = {
  name: "getTotalPurchaseAmount",
  description: "Calculate the total amount spent on purchases by a specific user",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description: "Unique identifier for the user whose total purchase amount is to be calculated"
      }
    },
    required: ["userID"]
  }
};

const purchaseStockFunctionDeclaration = {
  name: "purchaseStock",
  description: "Update the stock level of a specific product based on purchased stock",
  parameters: {
    type: "object",
    properties: {
      productID: {
        type: "string",
        description: "Unique identifier for the product whose stock is being updated"
      },
      purchaseStockData: {
        type: "number",
        description: "Amount of stock to be added to the product's current stock"
      }
    },
    required: ["productID", "purchaseStockData"]
  }
};

const addSalesFunctionDeclaration = {
  name: "addSales",
  description: "Add a new sales record and update the stock sold for multiple products using the given store name and product names",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description: "Unique identifier for the user making the sale"
      },
      products: {
        type: "array",
        description: "Array of products being sold",
        items: {
          type: "object",
          properties: {
            productName: {
              type: "string",
              description: "English name for the product being sold"
            },
            stockSold: {
              type: "number",
              description: "Quantity of the product sold"
            }
          },
          required: ["productName", "stockSold"]
        }
      },
      storeName: {
        type: "string",
        description: "Name of the store where the sale occurred"
      }
    },
    required: ["userID", "products", "storeName"]
  }
};

const getSalesDataFunctionDeclaration = {
  name: "getSalesData",
  description: "Retrieve all sales data for a specific user",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description: "Unique identifier for the user whose sales data is to be retrieved"
      }
    },
    required: ["userID"]
  }
};

const getTotalSalesAmountFunctionDeclaration = {
  name: "getTotalSalesAmount",
  description: "Calculate the total sales amount for a specific user",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description: "Unique identifier for the user whose total sales amount is to be calculated"
      }
    },
    required: ["userID"]
  }
};

const soldStockFunctionDeclaration = {
  name: "soldStock",
  description: "Update the stock level of a specific product based on the amount of stock sold",
  parameters: {
    type: "object",
    properties: {
      productID: {
        type: "string",
        description: "Unique identifier for the product whose stock is being updated"
      },
      stockSoldData: {
        type: "number",
        description: "Amount of stock that has been sold and should be deducted from the current stock"
      }
    },
    required: ["productID", "stockSoldData"]
  }
};

const addStoreFunctionDeclaration = {
  name: "addStore",
  description: "Add a new store to the database",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description: "Unique identifier for the user creating the store"
      },
      name: {
        type: "string",
        description: "Name of the store"
      },
      category: {
        type: "string",
        description: "Category of the store (e.g., grocery, electronics)"
      },
      address: {
        type: "string",
        description: "Address of the store"
      },
      city: {
        type: "string",
        description: "City where the store is located"
      },
      image: {
        type: "string",
        description: "URL or path to the store's image"
      }
    },
    required: ["userID", "name", "category", "address", "city"]
  }
};

const getAllStoresFunctionDeclaration = {
  name: "getAllStores",
  description: "Retrieve all stores associated with a specific user",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description: "Unique identifier for the user whose stores are to be retrieved"
      }
    },
    required: ["userID"]
  }
};

const addProductFunctionDeclaration = {
  name: "addProduct",
  description: "Add a new product to the database",
  parameters: {
    type: "object",
    properties: {
      userId: {
        type: "string",
        description: "Unique identifier for the user adding the product"
      },
      name: {
        type: "string",
        description: "Name of the product in English and always taken as singular"
      },
      manufacturer: {
        type: "string",
        description: "Manufacturer of the product"
      },
      stock: {
        type: "number",
        description: "Quantity of stock available for the product"
      },
      description: {
        type: "string",
        description: "Description of the product written in user-given English"
      },
      price: {
        type: "number",
        description: "Price of the product"
      }
    },
    required: ["userId", "name", "manufacturer", "stock", "price"]
  }
};

const getAllProductsFunctionDeclaration = {
  name: "getAllProducts",
  description: "Retrieve all products for a specific user",
  parameters: {
    type: "object",
    properties: {
      userID: {
        type: "string",
        description: "Unique identifier for the user whose products are to be retrieved"
      }
    },
    required: ["userID"]
  }
};

const deleteSelectedProductFunctionDeclaration = {
  name: "deleteSelectedProduct",
  description: "Delete a specific product",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the product to be deleted in English"
      }
    },
    required: ["name"]
  }
};

const updateSelectedProductFunctionDeclaration = {
  name: "updateSelectedProduct",
  description: "Update details of a specific product",
  parameters: {
    type: "object",
    properties: {
      newName: {
        type: "string",
        description: "Updated name of the product"
      },
      name: {
        type: "string",
        description: "Name of the product in English"
      },
      manufacturer: {
        type: "string",
        description: "Updated manufacturer of the product"
      },
      description: {
        type: "string",
        description: "Updated description of the product in the same language as provided by the user"
      },
      price: {
        type: "number",
        description: "Updated price of the product"
      },
      stock: {
        type: "number",
        description: "Updated stock quantity of the product"
      }
    },
    required: ["name"]
  }
};

const getProductByNameFunctionDeclaration = {
  name: "getProductByName",
  description: "Retrieve product information based on the product name",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the product in English"
      }
    },
    required: ["name"]
  }
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
  getProductByNameFunctionDeclaration
};
