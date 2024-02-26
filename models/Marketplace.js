const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const MarketplaceVehicleSchema = require("./MarketplaceVehicles");

const MarketplaceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    user: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      name: { type: String },
      contactNo: { type: String },
      contactNo2: { type: String },
      email: { type: String },
      address: { type: String },
    },

    title: {
      type: String,
    },
    description: {
      A: { type: String },
      A1: { type: String },
      B: { type: String },
      B1: { type: String },
      C: { type: String },
      C1: { type: String },
      D: { type: String },
      D1: { type: String },
      E: { type: String },
      E1: { type: String },
      F: { type: String },
      F1: { type: String },
      G: { type: String },
      G1: { type: String },
      H: { type: String },
      H1: { type: String },
      I: { type: String },
      I1: { type: String },
      J: { type: String },
      J1: { type: String },
      K: { type: String },
      V: { type: String },
    },
    vehicle: MarketplaceVehicleSchema,
    images: {
      type: [String],
    },

    firebaseFolderId: {
      type: String,
    },
    firebaseFolderObject: {
      type: Object,
    },
    addCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "marketplace_add_category",
      },
    ],
    province: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "provinces",
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "district",
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "city",
    },
    price: {
      type: Number,
    },
    discount: {
      amount: {
        type: Number,
      },
      percentage: {
        type: Number,
      },
    },
    condition: {
      type: String,
    },
    sold: {
      type: Boolean,
      default: false,
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    ongoingLease: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Pending",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
MarketplaceSchema.plugin(mongoosePaginate);

module.exports = Marketplace = mongoose.model(
  "marketplace-adds",
  MarketplaceSchema
);
