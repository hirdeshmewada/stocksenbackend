const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique:true
    },
    category: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: false }
);
StoreSchema.index({name:'text'})
const Store = mongoose.model("store", StoreSchema);
module.exports = Store;
