const path = require("path");
const express = require("express");
const router = express.Router();
const fs = require("fs");

const dirPath = path.join(__dirname, "public/views");

const files = fs.readdirSync(dirPath).map((name) => {
  return {
    name: path.basename(name, ".pdf"),
    url: `/pdfs/${name}`,
  };
});

router.get("/", (req, res) => {
  res.download(`${dirPath}/indunil.pdf`);
});

module.exports = router;
