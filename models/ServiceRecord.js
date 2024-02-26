const mongoose = require("mongoose");

const ServiceRecordSchema = new mongoose.Schema({
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
    required: true,
  },
  registeredCustomer: {
    type: Boolean,
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
  serviceList: [
    {
      serviceTypeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicle_service_types",
      },
      serviceTypeName: { type: String },
      technician: { type: String },
      serviceCost: { type: Number },
      serviceDiscount: { type: Number },
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

module.exports = ServiceRecord = mongoose.model(
  "service_record",
  ServiceRecordSchema
);
