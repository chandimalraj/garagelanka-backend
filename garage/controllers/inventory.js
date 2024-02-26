const config = require("config");
const { validationResult } = require("express-validator");
const Inventory = require("../../models/Inventory");
const partModel = require("../../models/Parts");

exports.addInventory = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Add inventory to DB

    const {
      item_name,
      item_barcode,
      buying_price,
      selling_price,
      quantity,
      online_status,
    } = req.body;

    // const { serviceCenterID } = req.user.serviceCenterID;
    console.log(req.user.serviceCenterID);

    const inventory = new Inventory({
      item_name,
      item_barcode,
      buying_price,
      selling_price,
      quantity,
      online_status,
    });

    await inventory.save();

    res.json({ status: "Inventory added successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.checkBarcode = async (req, res) => {
  const { barcode } = req.query;
  const { serviceCenter } = req.user;

  try {
    const model = serviceCenter._id;
    const Part = partModel(model);
    const result = await Part.find({ barcodeNumber: barcode });

    if (result.length !== 0) {
      res.status(200).json({is_exists: true })
    } else {
      res.status(200).json({is_exists: false})
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
