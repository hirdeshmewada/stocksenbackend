const addPurchaseFunctionDeclaration = {
  name: "addSales",
  parameters: {
    type: "OBJECT",
    description: "Add a new purchase record and update the stock sold",
    properties: {
      userID: {
        type: "STRING",
        description: "Unique identifier for the user making the sale",
      },
      productName: {
        type: "STRING",
        description: "Product Name for the product being sold in english",
      },
      storeName: {
        type: "STRING",
        description: "Store name for the store where the sale occurred",
      },
      stockSold: {
        type: "NUMBER",
        description: "Quantity of stock sold",
      },
    },
    required: ["userID", "productName", "storeName", "stockSold"],
  },
};

module.exports = { addPurchaseFunctionDeclaration };
