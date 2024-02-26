const mongoose = require("mongoose");

const serviceExpenseModels = {}

const ServiceExpenseSchema = new mongoose.Schema({

  service_center_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service_center",
    required: true,
  },
  service_list: [
    {
     service_code: { type: String },
     service_cost: { type: String },
     total: { type: String },
     service_discount_amount: { type: String },
     final_service_amount: { type: String },   
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

const serviceExpenseModel = collectionName => {
    
  if (!(collectionName in serviceExpenseModels)) {

    serviceExpenseModels[collectionName] = mongoose.model(
      collectionName,
      ServiceExpenseSchema,
      collectionName
    );
  }
  return serviceExpenseModels[collectionName];
};

module.exports = serviceExpenseModel

// module.exports = ServiceBillingItem = mongoose.model(
//   "service_billing_items",
//   ServiceBillingItemSchema
// );
