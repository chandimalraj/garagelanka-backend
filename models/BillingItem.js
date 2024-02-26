const mongoose = require("mongoose");

const instantBillModules = {};

const BillingItemSchema = new mongoose.Schema({
  serviceCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service_center",
    required: true,
  },
  itemList: [
    {
      itemName: { type: String },
      brand: { type: String },
      itemCode: { type: String },
      barcode: { type: String },
      qnt: { type: Number },
      unit: { type: String },
      desc: { type: String },
      unitPrice: { type: Number },
      unitDiscount: { type: Number },
      total: { type: Number },
    },
  ],
  billingDate: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  discount: {
    type: Number,
    // required: true,
  },
  grandTotal: {
    type: Number,
    // required: true,
  },
  customer: {
    type: Object,
  },
});

const instantBillModel = (collectionName) => {
  if (!(collectionName in instantBillModules)) {
    instantBillModules[collectionName] = mongoose.model(
      collectionName,
      BillingItemSchema,
      collectionName
    );
  }
  return instantBillModules[collectionName];
};

module.exports = instantBillModel;

// module.exports = BillingItem = mongoose.model(
//   "billing_items",
//   BillingItemSchema
// );
