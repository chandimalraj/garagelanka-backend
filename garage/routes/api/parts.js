const path = require("path");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const partsController = require("../../controllers/parts");

router.post(
  "/add-categories",
  auth,
  [body("categories", "categories should be an array").isArray()],
  partsController.addPartsCategories
);

// get all parts of a servicecenter

router.get(
  "/get-all-parts",
  auth,
  partsController.getPartAllPartsOfServiceCenter
);

// get all categories
router.get("/get-all-categories", auth, partsController.getAllCategories);

//  Update User with token
// multer configaration
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb(null, false); //reject file
};

const upload = multer({
  storage: multer.memoryStorage(), //storage,
  limits: { fileSize: 1024 * 1024 * 2 }, //file size 2MB
  fileFilter: fileFilter,
});

router.post(
  "/add-part",
  auth,
  upload.single("partImage"),
  // [
  //   body("itemId", "itemId is required").not().isEmpty(),
  //   body("itemName", "Item name is required").not().isEmpty(),
  //   body("categoryId", "categoryId is required").not().isEmpty(),
  //   body("barcodeNumber", "barcode number is required").not().isEmpty(),
  //   body(
  //     "availableForOnlineSelling",
  //     "Available For Online Selling is required"
  //   ),
  // ],
  partsController.addParts
);

router.get("/getpartfrombarcode", auth, partsController.getPartFromBarcode);

// get parts of a category of a service center
router.get(
  "/getPartsOfCategory/:categoryID",
  auth,
  partsController.getPartsOfServiceCenterOfACategory
);

router.get(
  "/getPartsOfOnlineSelling/:category",
  auth,
  partsController.getPartAllPartsOfOnlineSellingCategory
);

// remove part from inventory and online selling
router.delete("/remove-part/:barcode", auth, partsController.removePart);

// modify part in inventory and online selling
router.patch(
  "/edit-part",
  auth,
  [
    body("itemId", "itemId is required").not().isEmpty(),
    body("itemName", "Item name is required").not().isEmpty(),
    body("categoryId", "categoryId is required").not().isEmpty(),
    body("barcodeNumber", "barcode number is required").not().isEmpty(),
    body(
      "availableForOnlineSelling",
      "Available For Online Selling is required"
    ),
  ],
  partsController.editPart
);

module.exports = router;
