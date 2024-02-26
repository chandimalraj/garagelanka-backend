const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const serviceBillModules = {};

const ServiceBillingItemSchema = new mongoose.Schema({
  invoiceNo: {
    type: String,
    unique: true,
  },
  bookingRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking",
  },
  serviceCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service_center",
    required: true,
  },
  billingDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  registeredCustomer: {
    type: Boolean,
    required: true,
  },
  customer: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },

    mobile: {
      type: String,
    },
  },
  itemList: [
    {
      itemName: { type: String },
      brand: { type: String },
      itemCode: { type: String },
      barcode: { type: String },
      unit: { type: String },
      desc: { type: String },
      qnt: { type: Number },
      unitPrice: { type: Number },
      unitDiscount: { type: Number },
      total: { type: Number },
    },
  ],
  serviceList: [
    {
      serviceTypeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicle_service_types",
      },
      serviceTypeName: { type: String },
      technician: { type: String },
      serviceCost: { type: Number },
      total: { type: Number },
    },
  ],
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle",
  },
  vehicleRegNo: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  billingType: {
    type: String,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  discountCode: {
    type: String,
  },
  discount: {
    type: Number,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
});

ServiceBillingItemSchema.plugin(mongoosePaginate);

const serviceBillModel = (collectionName) => {
  if (!(collectionName in serviceBillModules)) {
    serviceBillModules[collectionName] = mongoose.model(
      collectionName,
      ServiceBillingItemSchema,
      collectionName
    );
  }
  return serviceBillModules[collectionName];
};

// const ServiceRecord = mongoose.model(
//   "service_record",
//   ServiceBillingItemSchema
// );

module.exports = serviceBillModel;

// module.exports = {
//   serviceBillModel,
//   ServiceRecord,
// };

// module.exports = ServiceBillingItem = mongoose.model(
//   "service_billing_items",
//   ServiceBillingItemSchema
// );
