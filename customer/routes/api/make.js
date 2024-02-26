const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const Make = require("../../../models/Make");
// bring vehicle controller
const makeController = require("../../controllers/make");
// @route   POST api/generalInfo/districts
// @desc    get all districts
// @access  Public
router.get("/", async (req, res) => {
  console.log("Loading all makes...");
  try {
    await Make.find(function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// router.post("/makeList", (req, res) => {
//     const body = req.body();
//     console.log(body);
//     Make.save(body)
//         .then((response) => {
//             console.log("saved to mongo db", response);
//             res.json(response);
//         })
//         .catch((error) => {
//             console.log("error in saving to mongo db", error);
//             res.json(error);
//         });
// });

// @route POST api / vehicles
// @desc Register vehicles
// @access Private
router.post(
  "/makelist",
  [
    body("make_id", "make id is required").not().isEmpty(),
    body("name_en", "name in eng is required").not().isEmpty(),
  ],
  makeController.registermake
);

module.exports = router;
