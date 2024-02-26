const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  supplierName: {
    type: String,
    required: true,
  },
  address: {
    addressLineOne: {
      type: String,
    },
    addressLineTwo: {
      type: String,
    },
    postalCode: {
      type: String,
    },
  },
  phone: {
    type: String,
  },
  mobile: {
    type: String,
  },
  email: {
    type: String,
  },

  website: {
    type: String,
  },

  bankAccount: {
    accountNumber: {
      type: String,
    },
    accountHolderName: {
      type: String,
    },
    bankName: {
      type: String,
    },
    branchName: {
      type: String,
    },
  },
  contactPerson: {
    name: {
      type: String,
    },
    mobile: {
      type: String,
    },
  },
});

module.exports = Supplier = mongoose.model("supplier", SupplierSchema);
