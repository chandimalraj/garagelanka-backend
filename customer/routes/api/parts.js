const path = require("path");
const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const parts = require("../../controllers/parts");

router.get("/searchparts", parts.searchParts);

router.get("/categories", parts.getPartsCategories);

router.get("/:category", parts.getPartsByCategory);

router.get("/:category/:id", parts.getPartById);

router.post("/filter", parts.filterParts);

module.exports = router;
