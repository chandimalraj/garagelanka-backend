var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const Images = require("../../models/Images");

// load all homa page cover images
exports.loadAllImages = async (req, res) => {
  console.log("Loading all service types...");
  try {
    await Images.find({ section: "cover" }, function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.registerImages = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { imageName, imageURL } = req.body;

    let image = await Images.findOne({
      imageName: imageName,
    });

    if (image) {
      res
        .status(400)
        .json({ errors: [{ msg: "Image Name alrady registered" }] });
    } else {
      //Add new image

      imageObj = new Images({
        section: "cover",
        imageName,
        imageURL,
      });

      await imageObj.save();

      res.json({ status: "image Has been saved successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

exports.uppdateImages = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { imageName, newImageURL } = req.body;

    let image = await Images.findOne({
      imageName: imageName,
    });

    if (!image) {
      res
        .status(400)
        .json({ errors: [{ msg: "Image Name is not registerd registered" }] });
    } else {
      image.imageURL = newImageURL;

      await image.save();

      res.json({ status: "image Has been updated  successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

// images for spare parts in home page

exports.loadAllPartsImages = async (req, res) => {
  console.log("Loading all parts advertestment images...");
  try {
    await Images.find({ section: "parts" }, function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.registerPartsImages = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { imageName, imageURL } = req.body;

    let image = await Images.findOne({
      imageName: imageName,
      section: "parts",
    });

    if (image) {
      res
        .status(400)
        .json({ errors: [{ msg: "Image Name alrady registered" }] });
    } else {
      //Add new image

      imageObj = new Images({
        section: "parts",
        imageName,
        imageURL,
      });

      await imageObj.save();

      res.json({ status: "image Has been saved successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

exports.uppdatePartsImages = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { imageName, newImageURL } = req.body;

    let image = await Images.findOne({
      section: "parts",
      imageName: imageName,
    });

    if (!image) {
      res
        .status(400)
        .json({ errors: [{ msg: "Image Name is not registerd registered" }] });
    } else {
      image.imageURL = newImageURL;

      await image.save();

      res.json({ status: "image Has been updated  successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

// images for hot dealss in home page

exports.loadAllHotDealsImages = async (req, res) => {
  console.log("Loading HotDeals images...");
  try {
    await Images.find({ section: "HotDeals" }, function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.registerHotDealsImages = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { imageName, imageURL, details } = req.body;

    let image = await Images.findOne({
      imageName: imageName,
      section: "HotDeals",
    });

    if (image) {
      res
        .status(400)
        .json({ errors: [{ msg: "Image Name alrady registered" }] });
    } else {
      //Add new image

      imageObj = new Images({
        section: "HotDeals",
        imageName,
        imageURL,
        details,
      });

      await imageObj.save();

      res.json({ status: "image Has been saved successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

exports.uppdateHotDealsImages = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { imageName, newImageURL, details } = req.body;

    let image = await Images.findOne({
      section: "HotDeals",
      imageName: imageName,
    });

    if (!image) {
      res
        .status(400)
        .json({ errors: [{ msg: "Image Name is not registerd" }] });
    } else {
      if (newImageURL) {
        image.imageURL = newImageURL;
      }
      if (details) {
        image.details = image.details;
      }

      await image.save();

      res.json({ status: "image Has been updated  successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

// Register Common images

exports.registerCommonImages = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { imageName, imageURL, section } = req.body;

    let image = await Images.findOne({
      imageName: imageName,
      section: section,
    });

    if (image) {
      res
        .status(400)
        .json({ errors: [{ msg: "Image Name alrady registered" }] });
    } else {
      //Add new image

      imageObj = new Images({
        section: section,
        imageName,
        imageURL,
      });

      await imageObj.save();

      res.json({ status: "image Has been saved successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

//  Update  common images
exports.uppdateCommonImages = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { imageName, newImageURL, section } = req.body;

    let image = await Images.findOne({
      section: section,
      imageName: imageName,
    });

    if (!image) {
      res
        .status(400)
        .json({ errors: [{ msg: "Image Name is not registerd registered" }] });
    } else {
      image.imageURL = newImageURL;

      await image.save();

      res.json({ status: "image Has been updated  successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

// load all Vehicle market cover images
exports.loadAllVehicleImages = async (req, res) => {
  console.log("loading all vehicle images");
  try {
    await Images.find({ section: "VehicleMarket" }, function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// load all common images of selected section
exports.loadAllCommonImages = async (req, res) => {
  section = req.query.section;
  console.log(`loading all ${section} images`);

  try {
    await Images.find({ section: section }, function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
