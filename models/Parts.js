const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

let partModels = {};

const PartsSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  serviceCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service_center",
    required: true,
  },
  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "district",
    required: true,
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city",
    required: true,
  },
  country: {
    type: String,
    required: false,
  },
  brand: {
    type: String,
    required: false,
  },
  barcodeNumber: {
    type: String,
    required: false,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "caegory",
    required: true,
  },
  subCategory: {
    type: String,
  },
  description: {
    type: [
      {
        title: String,
        description: String,
      },
    ],
    required: false,
  },
  unit: {
    type: String,
  },
  buyingPrice: {
    type: Number,
    required: false,
  },
  sellingPrice: {
    type: Number,
    required: false,
  },
  discount: {
    type: Number,
    default: 0,
  },
  totalQuntity: {
    type: Number,
    default: 0,
    required: true,
  },
  inventoryQuntity: {
    type: Number,
    default: 0,
  },
  location: {
    room: { type: String, default: "Not Defined" },
    rack: { type: String, default: "Not Defined" },
    flor: { type: String, default: "Not Defined" },
  },
  vehicle: {
    makeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "make",
    },
    makeName: {
      type: String,
    },
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "model",
    },
    modelName: {
      type: String,
    },
    year: {
      type: String,
    },
    engineCode: {
      type: String,
    },
    fuelType: {
      type: String,
    },
    transmissionType: {
      type: String,
    },
    engineCapacity: {
      type: String,
    },
  },
  availableForOnlineSelling: {
    type: Boolean,
    default: false,
  },
  onlineSellingQuntity: {
    type: Number,
    default: 0,
  },
  onlinePrice: {
    type: Number,
    default: 0,
  },
});

PartsSchema.plugin(mongoosePaginate);

const partModel = (collectionName) => {
  if (!(collectionName in partModels)) {
    partModels[collectionName] = mongoose.model(
      collectionName,
      PartsSchema,
      collectionName
    );
  }
  return partModels[collectionName];
};

module.exports = partModel;
