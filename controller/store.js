const Store = require("../models/Store");

const addStore = async (req, res) => {
  // Check if LLM mode is enabled
  if (req?.LLM === true) {
    try {
      const addStore = new Store({
        userID: req?.body?.userId,
        name: req?.body?.name,
        category: req?.body?.category,
        address: req?.body?.address,
        city: req?.body?.city,
        image: req?.body?.image,
      });
      const savedStore = await addStore.save();
      return savedStore; // Return the result for LLM mode
    } catch (error) {
      console.error("Error adding store: ", error);
      return `Error adding store: ${error.message}`; // Return the error message for LLM mode
    }
  }

  // Standard API Mode
  try {
    const addStore = new Store({
      userID: req?.body?.userId,
      name: req?.body?.name,
      category: req?.body?.category,
      address: req?.body?.address,
      city: req?.body?.city,
      image: req?.body?.image,
    });

    const savedStore = await addStore.save();
    res.status(200).send(savedStore);
  } catch (err) {
    res.status(402).send(err);
  }
};

const getAllStores = async (req, res) => {
  // Check if LLM mode is enabled
  if (req?.LLM === true) {
    try {
      const findAllStores = await Store.find({
        userID: req?.params?.userID,
      }).sort({ _id: -1 });
      return findAllStores; // Return the result for LLM mode
    } catch (error) {
      console.error("Error fetching all stores: ", error);
      return `Error fetching all stores: ${error.message}`; // Return the error message for LLM mode
    }
  }

  // Standard API Mode
  try {
    const findAllStores = await Store.find({
      userID: req?.params?.userID,
    }).sort({ _id: -1 });
    res.json(findAllStores);
  } catch (error) {
    console.error("Error fetching all stores: ", error);
    res.status(500).send("Server error");
  }
};

const editStore = async (req, res) => {
  const { name, category, address, city, image } = req.body;

  // Check if LLM mode is enabled
  if (req?.LLM === true) {
    try {
      const updatedStore = await Store.findOneAndUpdate(
        { name: req?.body?.name },
        { name, category, address, city, image },
        { new: true } // Return the updated document
      );

      if (!updatedStore) {
        return `Store with name ${req?.body?.name} not found`; // Return error message if in LLM mode
      }

      return updatedStore; // Return the result for LLM mode
    } catch (error) {
      console.error("Error updating store by name: ", error);
      return `Error updating store: ${error.message}`; // Return error message for LLM mode
    }
  }

  // Standard API Mode (search by ID)
  try {
    const updatedStore = await Store.findByIdAndUpdate(
      req?.params?.id,
      { name, category, address, city, image },
      { new: true } // Return the updated document
    );

    if (!updatedStore) {
      return res.status(404).send(`Store with ID ${req?.params?.id} not found`);
    }

    res.status(200).send(updatedStore);
  } catch (error) {
    console.error("Error updating store by ID: ", error);
    res.status(500).send(`Error updating store: ${error.message}`);
  }
};

module.exports = { addStore, getAllStores, editStore };
