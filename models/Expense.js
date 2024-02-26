const mongoose = require("mongoose");

const expenseModels = {};

const ExpenseSchema = new mongoose.Schema({
  serviceCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service_center",
    required: true,
  },
  expenseDate: {
    type: Date,
    required: true,
  },
  itemList: [
    {
      itemCode: { type: String },
      itemName: { type: String },
      barcode: { type: String },
      brand: { type: String },
      qnt: { type: Number },
      unitPrice: { type: Number },
      total: { type: Number },
      cash: { type: Number },
      credit: { type: Number },
    },
  ],
  serviceList: [
    {
      service: { type: String },
      serviceCode: { type: String },
      serviceCost: { type: Number },
      cash: { type: Number },
      credit: { type: Number },
    },
  ],
  category: {
    type: String,
    required: true,
  },
  supplier: {
    type: String,
    // required: true,
  },
  remarks: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  totalCash: {
    type: Number,
    required: true,
  },
  totalCredit: {
    type: Number,
    required: true,
  },
});

const expenseModel = (collectionName) => {
  if (!(collectionName in expenseModels)) {
    expenseModels[collectionName] = mongoose.model(
      collectionName,
      ExpenseSchema,
      collectionName
    );
  }
  return expenseModels[collectionName];
};

module.exports = expenseModel;
