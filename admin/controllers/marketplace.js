var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const Marketplace = require("../../models/Marketplace");
const VehicleCategory = require("../../models/VehicleCategories");
const MarketplaceAddCategory = require("../../models/MarketplaceAddCategory");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");
const { searchQueryCreator } = require("./utils/queryCreator");

const topicFunction = require("../controllers/functions/topics");

exports.addVehicle = async (req, res) => {
  //   const errors = validationResult(req);

  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() });
  //   }

  try {
    const userReq = req.user;
    // const add = await Marketplace.findOne({ itemCode: req.body.itemCode });
    // if (add) return res.status(400).send("Advertistment Already Available");

    const user = {
      userId: ObjectId(userReq.id),
      ...req.body.user,
    };

    const userId = userReq.id;
    // console.log("User", user);
    const marketplaceAdd = new Marketplace({
      userId,
      user,
      ...req.body,
    });

    console.log("model", req.body.vehicle.model);

    const makeName = req.body.vehicle.makeName;
    const modelName = req.body.vehicle.modelName;
    const userObj = req.body.user;
    const district = req.body.districtName;

    const topic = `${makeName}_${modelName}`;

    const marketplaceAddSaved = await marketplaceAdd.save();
    console.log(marketplaceAddSaved);
    // send notifications to subscribed users

    const notificationObj = { topic, userObj, district };

    const result = await topicFunction.sendNotificationstoTopic(
      notificationObj
    );

    console.log("result ", result);

    res.json({
      // data: marketplaceAddSaved,
      msg: "Advertistment Successfully Saved",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.updateStatus = async (req, res) => {
  const { id, status } = req.body;
  console.log(id);
  Marketplace.findByIdAndUpdate(id, { status: status }, { new: true })
    .then((data) => {
      res.send({ msg: data });
    })
    .catch((err) => {
      res.send(err.message);
    });
};

exports.addVehicleCategory = async (req, res) => {
  //   const errors = validationResult(req);

  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() });
  //   }

  try {
    const category = await VehicleCategory.findOne({ name: req.body.name });
    if (category)
      return res.status(400).send("Vehicle Category Already Available");

    const newCategory = new VehicleCategory(req.body);
    const categorySaved = await newCategory.save();

    res.json({
      data: categorySaved,
      msg: "Vehicle Category Successfully Added",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.addMarketplaceCategory = async (req, res) => {
  //   const errors = validationResult(req);

  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() });
  //   }

  try {
    const category = await MarketplaceAddCategory.findOne({
      name: req.body.name,
    });
    if (category)
      return res.status(400).send("Marketplace Category Already Available");

    const newCategory = new MarketplaceAddCategory(req.body);
    const categorySaved = await newCategory.save();

    res.json({
      data: categorySaved,
      msg: "Marketplace Category Successfully Added",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.searchByPhone = (req, res) => {
  const { phoneNum } = req.body;
  console.log(phoneNum);
  Marketplace.find({ "user.contactNo": phoneNum })
    .then((data1) => {
      Marketplace.find({ "user.contactNo2": phoneNum })
        .then((data2) => {
          res.status(200).send({ data: { docs: data1, data2 } });
        })
        .catch((e) => {
          res.status(200).send({ data: { docs: data1 } });
        });
    })
    .catch((e) => {
      res.send(e.message);
    });
};

exports.getAddCount = async (req, res) => {
  let addCount = {};
  Marketplace.find({ status: "Pending" }).then((resp) => {
    addCount.pending = resp.length;
    Marketplace.find({ status: "Live" }).then((resp) => {
      addCount.live = resp.length;
      Marketplace.find({ status: "Rejected" }).then((resp) => {
        addCount.rejected = resp.length;
        res.status(200).send(addCount);
      });
    });
  });
};

exports.deleteAdd = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;

  Marketplace.deleteOne({ _id: id })
    .then(() => {
      res.status(200).send({ data: "Successfully Deleted" });
    })
    .catch((err) => {
      res.status(200).send(err.message);
    });
};

exports.getAllAdds = async (req, res) => {
  try {
    //  pagination
    let limit = 10;
    let page = 1;
    const { status } = req.query;
    const condition = { sold: false, status: status };

    if (req.query.page) {
      page = req.query.page;
    }

    if (page <= 0) {
      return res
        .status(400)
        .json({ msg: "page number shuld be grater than or equel 1 " });
    } else {
      if (req.query.limit) {
        limit = req.query.limit;
      }

      // set the offset

      const offset = await (limit * (page - 1));
      const adds = await Marketplace.paginate(condition, {
        offset: offset,
        limit: limit,
      });

      const sortAdds = adds.docs.sort((a, b) => {
        if (a.createdAt.getTime() > b.createAt.getTime()) {
          return 1;
        } else if (a.createdAt.getTime() < b.createAt.getTime()) {
          return -1;
        } else {
          return 0;
        }
      });

      console.log(sortAdds);

      if (adds.length === 0) {
        return res.status(404).json({ msg: "No Advertistments Found" });
      } else {
        return res.status(200).json({ data: sortAdds });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error in vehicle get");
  }
};

exports.getAddbyId = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const add = await Marketplace.findById(id)
      .populate("user")

      .populate("district")
      .populate("city");

    if (!add) return res.status(404).json({ msg: "No Advertisement Found" });

    res.json({ data: add });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error in vehicle get");
  }
};

// Get adds by user id
exports.myadds = async (req, res) => {
  try {
    console.log("user", req.user);

    const add = await Marketplace.find({ userId: ObjectId(req.user.id) })
      .populate("user")
      .populate("province")
      .populate("district")
      .populate("city");

    if (!add) {
      return res.status(404).json({ msg: "No Advertistment Found" });
    } else {
      res.status(200).json({ data: add });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error in vehicle get");
  }
};

// delete my ads by ad id

exports.filterAdds = async (req, res) => {
  try {
    const searchQuery = searchQueryCreator(req.query);

    //  pagination
    let limit = 10;
    let page = 1;

    if (req.query.page) {
      page = req.query.page;
    }

    if (page <= 0) {
      return res
        .status(400)
        .json({ msg: "page number shuld be grater than or equel 1 " });
    } else {
      if (req.query.limit) {
        limit = req.query.limit;
      }

      // set the offset

      const offset = await (limit * (page - 1));
      const adds = await Marketplace.paginate(searchQuery, {
        offset: offset,
        limit: limit,
      });

      if (adds.length === 0) {
        return res.status(404).json({ msg: "No Advertistments Found" });
      } else {
        return res.status(200).json({ data: adds });
      }
    }

    // const adds = await Marketplace.find(searchQuery);

    // if (adds.length === 0) {
    //   return res.status(404).json({ msg: "No Advertistment Found" });
    // }

    // res.json({ data: adds });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error in vehicle get");
  }
};

// delete my ad by ad id
exports.deleteMyAd = async (req, res) => {
  try {
    const ad = await Marketplace.findById(req.query.id);

    console.log("add id", req.query.id);

    // req.query.booking_id

    if (!ad) return res.status(404).json({ msg: "Advertestment  not found" });

    // when user id of ad not match
    if (req.user.id !== ad.userId.toString())
      return res.status(401).json({ msg: "User not Authorized" });

    ad.remove();
    res.status(200).json({ msg: "Advertestment Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

// update my ad by ad id
exports.updateMyAd = async (req, res) => {
  try {
    const ad = await Marketplace.findById(req.query._id);

    // ad id not match
    if (!ad) return res.status(404).json({ msg: "Ad not found" });
    else {
      // console.log(req.user.id, ad.userId.toString())
      // when user id of ad not match
      if (req.user.id !== ad.userId.toString())
        return res.status(401).json({ msg: "User not Authorized" });
      else {
        // updating ad
        const newAd = await Marketplace.findOneAndUpdate(
          { _id: req.body._id },
          req.body,
          { new: true }
        );
        res.status(200).json({ data: newAd });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
