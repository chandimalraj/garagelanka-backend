const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const OrderSchema = new mongoose.Schema({
  timeStamps: {
    placed: {
      type: Date,
      required: true,
    },
    completed: {
      type: Date,
    },
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  customer: {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    firstName: {
      type: String,
      //required: true,
    },
    lastName: {
      type: String,
      //required: true,
    },
    contactNo: {
      type: Number,
      //required: true,
    },
    contactNo2: {
      type: Number,
    },
    email: {
      type: String,
    },
    address: {
      number: {
        type: String,
        //required: true,
      },
      street: {
        type: String,
        //required: true,
      },

      city: {
        type: String,
        //required: true,
      },
    },
  },
  payment: {
    status: {
      type: String,
    },
    method: {
      type: String,
    },
    amount: {
      type: Number,
    },
  },
  noOfItems: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  subOrders: [
    {
      serviceCenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service_center",
        required: true,
      },
      total: { type: Number },
      deliveryCost: { type: Number },
      discount: { type: Number },
      subTotal: { type: Number },
      sellerStatus: { type: String, default: "Pending" },
      sellerNotes: { type: String },
      payment: {
        status: {
          type: String,
          default: "Pending",
        },
        method: {
          type: String,
        },
        amount: {
          type: Number,
        },
      },
      tracking: {
        courierServiceName: String,
        trackingNumber: String,
      },
      items: [
        {
          // itemId: {
          //   //object Id
          // },
          itemName: { type: String },
          categoryId: { type: ObjectId },
          brand: { type: String },
          itemId: { type: String },
          barcodeNumber: { type: String },
          // description: { type: String, default: " " },
          onlinePrice: { type: Number, require: true },
          discount: { type: Number },
          qty: { type: Number, require: true },
          total: { type: Number, require: true },
        },
      ],
      timeStamps: {
        placed: {
          type: Date,
        },
        accepted: {
          type: Date,
        },
        dispatched: {
          type: Date,
        },
        collected: {
          type: Date,
        },
      },
    },
  ],
  remarks: {
    type: String,
  },
});

module.exports = Order = mongoose.model("order", OrderSchema);
