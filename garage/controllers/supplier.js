// bring supplier models
const { validationResult } = require("express-validator");
const SupplierModel = require("../../models/Supplier");

exports.addSupplier = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const supplierData = req.body;

    const supplier = await SupplierModel.findOne({
      supplierName: supplierData.supplierName,
    });

    if (supplier) {
      return res.status(400).send("Supplier Already Exists");
    } else {
      const newSupplier = new SupplierModel(supplierData);
      await newSupplier.save();
      return res.status(200).send("Supplier has been saved successfully");
    }

    // return;
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
};

// get all customers of a service center

exports.getAllSuppliers = async (req, res) => {
  console.log("Loading all Suppliers...");
  try {
    const suppliers = await SupplierModel.find();
    res.status(200).json(suppliers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
