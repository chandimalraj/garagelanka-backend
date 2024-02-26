// bring user,vehicle models
const config = require("config");
const { validationResult } = require("express-validator");
var ObjectId = require("mongodb").ObjectID;

const District = require("../../models/District");
const Category = require("../../models/Category");
const partModel = require("../../models/Parts");

const utils = require("./utils/addPartOnlineSelling");
const uploader = require("./utils/imageUploader");

exports.addPartsCategories = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let categories = req.body.categories;

    const current_categories = await Category.find({}).select("name");
    //get category names array
    let current_categories_names = [];
    current_categories.forEach((c) => {
      current_categories_names.push(c.name);
    });

    //filter new categories
    let new_categories = categories.filter((c) => {
      if (!current_categories_names.includes(c)) return true;
    });

    //save new categories
    new_categories.map((c) => {
      let newCategory = new Category({
        name: c,
      });
      newCategory.save();
    });

    if (new_categories.length > 0) {
      return res.status(200).json({
        msg: `${new_categories.length} Categories Sussesfully Added`,
      });
    } else {
      return res.status(200).json({
        msg: "All Categories Exists in the Database",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Load all catogories

exports.getAllCategories = async (req, res) => {
  console.log("Loading all Categories...");
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// add parts to the service center inventory and online selling

exports.addParts = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const partData = req.body;
    const { serviceCenter } = req.user;
    partData.serviceCenterId = serviceCenter._id;
    partData.districtId = serviceCenter.district_id;
    partData.cityId = serviceCenter.city_id;

    console.log("body", req.body.partData);
    console.log("files", req.files);
    console.log("file", req.file);
    console.log("partImage", typeof req.body.partImage);

    // set make ID and modelID to null if no mongo id receved

    if (partData.vehicle.makeId === "") {
      console.log(partData.vehicle.makeId);
      partData.vehicle.makeId = null;
    }
    if (partData.vehicle.modelId) {
      partData.vehicle.modelId = null;
    }
    let imgURL =
      "https://i.ibb.co/SJQ7qpf/depositphotos-97678252-stock-illustration-car-parts-auto-spare-parts.jpg";
    if (req.body.partImage) {
      //upload image to firebase storage and get public URL
      // the previos request file parser to the firebase
      let uploadRes = await uploader.imageUploader(
        req.file,
        partData.barcodeNumber
      );
      if (!uploadRes || uploadRes === "UPLOAD_ERR") {
        console.log("Error uploading to firebase");
      } else {
        console.log("image url ", uploadRes);
        imgURL = uploadRes;
      }
    }
    partData.image = imgURL;

    const model = serviceCenter._id;
    const Part = partModel(model);
    const result = await Part.find({ barcodeNumber: partData.barcodeNumber });

    if (result.length != 0) {
      if (partData.availableForOnlineSelling)
        utils.addPartOnlineSelling(partData, res);
      else res.status(400).send("Item Already Exists");
      return;
    }

    const newPart = new Part(partData);
    await newPart.save();

    if (partData.availableForOnlineSelling)
      utils.addPartOnlineSelling(partData, res);
    else res.status(200).send("Item has been saved successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getPartFromBarcode = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const barcode = req.query.barcode;

    const { serviceCenter } = req.user;

    const model = serviceCenter._id;
    const Part = partModel(model);

    const item = await Part.find({ barcodeNumber: barcode });

    res.status(200).send(item[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// load all parts of online selling of a category
exports.getPartAllPartsOfOnlineSellingCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const category = req.params.category;

    const model = category;

    const Part = partModel(model);
    const result = await Part.find();

    if (result.length != 0) {
      return res.status(200).send(result);
    } else {
      return res
        .status(400)
        .json({ msg: `There is no item in  ${category} category ` });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
};

// load all parts of service center
exports.getPartAllPartsOfServiceCenter = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //  pagination
    let limit = 50;
    let page = 1;

    console.log("req", req.query);
    // let condition =

    // set the page number
    if (req.query.page) {
      page = req.query.page;
    }

    if (page <= 0) {
      return res
        .status(400)
        .json({ msg: "page number should be greater than or equal 1" });
    } else {
      if (req.query.limit) {
        limit = req.query.limit;
      }

      // set the offset

      const offset = await (limit * (page - 1));

      const { serviceCenter } = req.user;

      const model = serviceCenter._id;
      const Part = partModel(model);

      const result = await Part.paginate({}, { offset: offset, limit: limit });

      res.status(200).send(result);
    }

    // pagination
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// load all parts of service center of a category
exports.getPartsOfServiceCenterOfACategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { serviceCenter } = req.user;
    const categoryId = req.params.categoryID;

    const model = serviceCenter._id;
    const Part = partModel(model);

    const result = await Part.find({
      categoryId: ObjectId(categoryId),
    });

    return res.status(200).send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.removePart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const barcode = req.params.barcode;
    console.log(barcode);
    const { serviceCenter } = req.user;
    const model = serviceCenter._id;
    console.log("service center id", serviceCenter._id);

    const serviceCenterInventory = partModel(model);
    const partInInventory = await serviceCenterInventory.find({
      barcodeNumber: barcode,
    });

    if (partInInventory.length === 0) {
      return res.status(200).json({ msg: "Item not found in inventory" });
    } else {
      const result = await serviceCenterInventory.deleteOne({
        barcodeNumber: barcode,
      });

      if (result.deletedCount > 0) {
        console.log("Item removed from inventory", barcode);
        if (partInInventory[0].availableForOnlineSelling) {
          await utils.removePartFromOnlineSelling(
            barcode,
            res,
            partInInventory[0].categoryId
          );
        }

        console.log("Item not found in inventory");
        return res
          .status(200)
          .json({ msg: "Item doesn't exists in inventory" });
      }
    }
  } catch (error) {
    console.error(error.message);
    console.log("Error in removing item from inventory");
    res.status(500).send("Server error");
  }
};

exports.editPart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const partData = req.body;
    const { serviceCenter } = req.user;
    const model = serviceCenter._id;
    console.log("service center id", serviceCenter._id);

    const serviceCenterInventory = partModel(model);
    const partInInventory = await serviceCenterInventory.find({
      barcodeNumber: partData.barcodeNumber,
    });

    // check whether part exists in inventory collection of service center
    if (partInInventory.length === 0) {
      return res.status(404).send("Item not found");
    } else {
      partData.serviceCenterId = serviceCenter._id;
      partData.districtId = serviceCenter.district_id;
      partData.cityId = serviceCenter.city_id;

      if (partData.vehicle.makeId) {
        partData.vehicle.makeId = null;
      }
      if (partData.vehicle.modelId) {
        partData.vehicle.modelId = null;
      }

      delete partData._id;

      // modify part in inventory
      const modifiedPartInventory =
        await serviceCenterInventory.findOneAndUpdate(
          { barcodeNumber: partData.barcodeNumber },
          partData,
          {
            new: true,
          }
        );

      // if not selling online, then remove part from online selling
      if (!partData.availableForOnlineSelling) {
        await utils.removePartFromOnlineSelling(
          partData.barcodeNumber,
          res,
          partInInventory[0].categoryId
        );
      }

      if (partData.availableForOnlineSelling) {
        // modifying part in online selling
        utils.editPartOnlineSelling(partData, res);
      }
      res.status(200).json({ msg: "Item modified successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
