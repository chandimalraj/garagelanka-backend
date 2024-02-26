const mongoose = require("mongoose");

const MarketplaceAddCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = MarketplaceAddCategory = mongoose.model(
  "marketplace_add_category",
  MarketplaceAddCategorySchema
);
