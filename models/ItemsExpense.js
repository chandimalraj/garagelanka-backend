const mongoose = require("mongoose");

const itemsExpenseModels = {}

const ItemExpenseSchema = new mongoose.Schema({

  // booking_ref: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "booking",
  //   required: true,
  // },
  service_center_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service_center",
    required: true,
  },
  item_list: [
     {
      item_code: { type: String },
      desc: { type: String },
      unit_price: { type: String },
      qnt: { type: String },
      total: { type: String },
      item_discount_amount: { type: String },
      final_item_amount: { type: String },
     
    },
  ],
  billing_date: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  total_amount: {
    type: String,
    required: true,
  },
  discount_code: {
    type: String,
    // required: true,
  },
  discount_amount: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  final_amount: {
    type: String,
    // required: true,
  },
});

const itemExpenseModel = collectionName => {
    
  if (!(collectionName in itemsExpenseModels)) {

    itemsExpenseModels[collectionName] = mongoose.model(
      collectionName,
      ItemExpenseSchema,
      collectionName
    );
  }
  return itemsExpenseModels[collectionName];
};

module.exports = itemExpenseModel

