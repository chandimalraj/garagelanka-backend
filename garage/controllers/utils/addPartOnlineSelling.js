const Category = require("../../../models/Category");
const partModel = require("../../../models/Parts");
const UniversalPartsSearch = require("../../../models/UniversalPartsSearch");

async function addPartOnlineSelling(partData, res) {
  try {
    const category = await Category.findById(partData.categoryId);
    const model = category.name.toLowerCase();

    const Part = partModel(model);
    const result = await Part.find({ barcodeNumber: partData.barcodeNumber });

    if (result.length != 0) {
      return res.status(400).send("Item Already Exists");
    }

    console.log("onlinesellingprice", partData.onlinePrice);
    partData.onlinePrice = partData.onlinePrice * 1.02;
    const newPart = new Part(partData);
    await newPart.save();

    console.log("part name ", model);
    console.log("new part has beenadded to the online sale", newPart);

    // add parts to universal parts table

    const unipart = new UniversalPartsSearch();

    unipart.itemId = newPart.itemId;
    unipart.itemName = newPart.itemName;
    unipart.partCollectionName = model;
    unipart.partMongoIdinCollection = newPart._id;
    unipart.onlineSellingQuntity = newPart.onlineSellingQuntity;
    unipart.barcodeNumber = newPart.barcodeNumber;

    unipart.save();

    res.status(200).send("Item has been saved successfully");
    return;
  } catch (error) {
    console.error("error in adding part online selling");
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

async function editPartOnlineSelling(partData, res) {
  const category = await Category.findById(partData.categoryId);
  const model = category.name.toLowerCase();

  try {
    if (!category) {
      console.log("category not found in online selling");
    } else {
      const onlineSellingPartCategory = partModel(model);

      // modify or create part in online selling
      const modifiedPartInOnlineSelling =
        await onlineSellingPartCategory.findOneAndUpdate(
          { barcodeNumber: partData.barcodeNumber },
          partData,
          {
            new: true,
            upsert: true,
          }
        );
      console.log("modify part in online selling", partData.barcodeNumber);
    }
  } catch (error) {
    console.error(error.message);
    console.error("error in edit part online selling");
    res.status(500).send("Server error");
  }
}

async function removePartFromOnlineSelling(barcode, res, categoryId) {
  const category = await Category.findById(categoryId);
  const onlineSellingCategory = category.name.toLowerCase();
  const onlineSellingCategoryModel = partModel(onlineSellingCategory);

  try {
    // remove item from online selling
    const result = await onlineSellingCategoryModel.deleteOne({
      barcodeNumber: barcode,
    });

    if (result.deletedCount > 0) {
      console.log("item removed from online selling", barcode);
    } else {
      console.log("item not found in online selling", barcode);
    }
  } catch (error) {
    console.error(error.message);
    console.error("error in remove part from online selling");
    res.status(500).send("Server error");
  }
}

module.exports = {
  addPartOnlineSelling,
  editPartOnlineSelling,
  removePartFromOnlineSelling,
};
