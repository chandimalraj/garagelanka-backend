const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ServiceCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  businessRegistrationNo: {
    type: String,
  },

  category: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  district_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "district",
    required: true,
  },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city",
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "garageuser",
  },
  location: { type: { type: String }, coordinates: [] },
  address: {
    type: String,
  },
  contact_no_1: {
    type: String,
  },

  contact_no_mobile: {
    type: String,
  },
  openTime: {
    type: Date,
  },
  closeTime: {
    type: Date,
  },
  logoUrl: {
    type: String,
  },

  imgUrl: {
    type: String,
  },
  holidays: [
    {
      type: Number,
    },
  ],

  premium: {
    type: Boolean,
  },
  rating: {
    properties: {
      rate: { type: Number, default: 0 },
      NumberOfRatings: { type: Number, default: 0 },
    },
  },
  servicesOffered: [
    {
      serviceTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicle_service_types",
      },
      serviceTypeName: {
        type: String,
      },
      colorCode: {
        type: String,
      },
      requiredTimeSlots: {
        type: String,
      },
      maximumParallel: {
        type: Number,
      },
    },
  ],

  fuelTypesProvided: [
    {
      fuelTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fuel_types",
      },
      fuelTypeName: {
        type: String,
      },
      fuelTypeimageURL: {
        type: String,
      },
      availability: {
        type: Boolean,
        default: true,
      },
    },
  ],

  discount: [
    {
      discountName: {
        type: String,
      },
      discountCode: {
        type: String,
      },
      serviceTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicle_service_types",
      },
      discountDisplayText: {
        type: String,
      },
      discountDescription: {
        type: String,
      },
      discountStartDate: {
        type: Date,
        required: true,
      },
      discountEndDate: {
        type: Date,
        required: true,
      },
    },
  ],
});

ServiceCenterSchema.plugin(mongoosePaginate);

module.exports = ServiceCenter = mongoose.model(
  "service_center",
  ServiceCenterSchema
);
