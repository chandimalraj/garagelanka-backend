const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  serviceCenterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service_center",
    // required: true,
  },
  itemName: {
    type: String,
  },

  itemBarcode: {
    type: String,
  },
  buyingPrice: {
    type: String,
  },
  sellingPrice: {
    type: String,
  },

  quantity: {
    type: String,
  },

  onlineStatus: {
    type: Boolean,
  },

  Date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Inventory = mongoose.model("inventory", InventorySchema);
