const addPurchaseFunctionDeclaration = {
    name: "addSales",
    parameters: {
      type: "OBJECT",
      description: "Add a new sales record and update the stock sold for multiple products",
      properties: {
        userID: {
          type: "STRING",
          description: "Unique identifier for the user making the sale",
        },
        soldProducts: {
          type: "ARRAY",
          description: "Array of products being sold",
          items: {
            type: "OBJECT",
            properties: {
              ProductName: {
                type: "STRING",
                description: "english name for the product being sold",
              },
              quantitySold: {
                type: "NUMBER",
                description: "Quantity of the product sold",
              },
            },
            required: ["ProductName", "quantitySold"],
          },
        },
        storeName: {
          type: "STRING",
          description: "name for the store where the sale occurred",
        },
        saleDate: {
          type: "STRING",
          format: "date-time",
          description: "Date when the sale occurred",
        },
      },
      required: ["userID", "soldProducts", "storeName"],
    },
};

module.exports = { addPurchaseFunctionDeclaration };


