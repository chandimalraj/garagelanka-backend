const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

const {
  addVehicle,
  addVehicleCategory,
  addMarketplaceCategory,
  getAllAdds,
  getAddbyId,
  filterAdds,
  myadds,
  deleteMyAd,
  updateMyAd,
  getAddCount,
  deleteAdd,
  updateStatus,
  searchByPhone,
} = require("../../controllers/marketplace");

router.get("/loadmyadds", auth, myadds);

// @route   DELETE /api/marketplace
// @desc    delete my ad by id
// @access  Private
router.delete("/deletmyadd/", auth, deleteMyAd);

router.post("/vehicle-category", addVehicleCategory);

router.post("/marketplace-category", addMarketplaceCategory);

router.post("/", auth, addVehicle);

router.get("/search", filterAdds);

router.get("/:id", getAddbyId);

router.post("/getAddCount", getAddCount);

router.post("/updatestatus", updateStatus);

router.delete("/deleteadd", deleteAdd);

router.get("/", getAllAdds);
router.post("/searchByPhone", searchByPhone);

// @route   PUT /api/marketplace
// @desc    update my ad by id
// @access  Private
router.put("/update-my-ad", auth, updateMyAd);

module.exports = router;
