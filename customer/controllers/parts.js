const Category = require("../../models/Category");
const partModel = require("../../models/Parts");
const UniversalPartsSearch = require("../../models/UniversalPartsSearch");
const ObjectId = require("mongodb").ObjectID;

const removedFields =
  "-location -inventoryQuntity -totalQuntity -buyingPrice -sellingPrice";
const selectedForOverview =
  "_id itemId itemName categoryId discount onlinePrice onlineSales barcodeNumber image";

exports.getPartsCategories = async (req, res) => {
  try {
    let categories = await Category.find({});

    res.status(200).send(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getPartById = async (req, res) => {
  try {
    const { category, id } = req.params;

    const Part = partModel(category);

    const items = await Part.findById(id).select(removedFields);

    if (items.length === 0) return res.status(404).send("No items found");

    res.status(200).send(items);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getPartsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const Part = partModel(category);

    const items = await Part.find({ availableForOnlineSelling: true }).select(
      selectedForOverview
    );

    if (items.length === 0) return res.status(404).send("No items found");

    res.status(200).send(items);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.filterParts = async (req, res) => {
  try {
    const { category, make, model, year } = req.body;

    if (!category) return res.send(400).json({ error: "Category is required" });

    const categoryR = await Category.findById(category);
    const categoryName = categoryR.name.toLowerCase();

    const Part = partModel(categoryName);
    let items = null;

    if (!make && !model && !year) {
      items = await Part.find({
        $and: [
          { availableForOnlineSelling: { $eq: true } },
          { categoryId: { $eq: category } },
        ],
      }).select(removedFields);
    }

    if (make && !model && !year) {
      items = await Part.find({
        $and: [
          { categoryId: { $eq: category } },
          { availableForOnlineSelling: { $eq: true } },

          { "vehicle.makeId": { $eq: make } },
        ],
      }).select(removedFields);
    }

    if (make && model && !year) {
      items = await Part.find({
        $and: [
          { categoryId: { $eq: category } },
          { availableForOnlineSelling: { $eq: true } },
          { "vehicle.makeId": { $eq: make } },
          { "vehicle.modelId": { $eq: model } },
        ],
      }).select(removedFields);
    }
    if (make && model && year) {
      items = await Part.find({
        $and: [
          { categoryId: { $eq: category } },
          { availableForOnlineSelling: { $eq: true } },
          { "vehicle.makeId": { $eq: make } },
          { "vehicle.modelId": { $eq: model } },
          { "vehicle.year": { $eq: year } },
        ],
      }).select(removedFields);
    }

    if (items.length === 0)
      return res.status(404).json({ error: "No items found" });

    return res.status(200).json({ data: items });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Universal part search
exports.searchParts = async (req, res) => {
  try {
    const itemId = req.query.itemId;
    const itemName = req.query.itemName;
    const barcodeNumber = req.query.barcodeNumber;

    let spareParts = [];
    // Search spare part items with barcode Number
    if (barcodeNumber) {
      const partsDetails = await UniversalPartsSearch.find({
        barcodeNumber: barcodeNumber,
      });
      if (partsDetails.length == 0) {
        res.status(404).send("No parts found");
      } else {
        await Promise.all(
          partsDetails.map(async (item) => {
            const Part = partModel(item.partCollectionName);
            const sparePart = await Part.findById({
              _id: ObjectId(item.partMongoIdinCollection),
            }).select(removedFields);
            spareParts.push(sparePart);
          })
        );
        await res.status(200).send(spareParts);
      }
    }
    // Search spare part items with item Number
    else if (itemId) {
      const partsDetails = await UniversalPartsSearch.find({
        itemId: { $regex: itemId, $options: "i" },
      });
      if (partsDetails.length == 0) {
        res.status(404).send("No parts found");
      } else {
        await Promise.all(
          partsDetails.map(async (item) => {
            const Part = partModel(item.partCollectionName);
            const sparePart = await Part.findById({
              _id: ObjectId(item.partMongoIdinCollection),
            }).select(removedFields);
            spareParts.push(sparePart);
          })
        );
        await res.status(200).send(spareParts);
      }
    }
    //search with model name
    else if (itemName) {
      const partsDetails = await UniversalPartsSearch.find({
        itemName: { $regex: itemName, $options: "i" },
      });
      console.log("part details", partsDetails.length);
      if (partsDetails.length == 0) {
        res.status(404).send("No parts found");
      } else {
        await Promise.all(
          partsDetails.map(async (item) => {
            const Part = partModel(item.partCollectionName);
            const sparePart = await Part.findById({
              _id: ObjectId(item.partMongoIdinCollection),
            }).select(removedFields);
            spareParts.push(sparePart);
          })
        );
        await res.status(200).send(spareParts);
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
