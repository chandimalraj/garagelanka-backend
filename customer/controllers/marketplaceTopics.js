var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const User = require("../../models/User");
// const topicFunction = require("../controllers/functions/topics");
const topicFunction = require("../../config/firebase");
const Notification = require("../../models/Notifications");

// add topic to user update user
//   if alrady subscribed show an error
//   unsbscribe user from 2nd oldest topic
//   return response or return success

exports.subscribeToTopic = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { make, makeName, model, modelName, firebaseId } = req.body;
    const userId = req.user.id;

    console.log("body", req.body);

    const subscribeObj = {
      make,
      makeName,
      model,
      modelName,
      firebaseId,
      userId,
    };

    const topic = `${makeName}_${modelName}`;

    const user = await User.findById({ _id: ObjectId(req.user.id) });

    if (!user) {
      console.log("There is no user");
      res.status(400).json({ errors: [{ msg: "There is no user" }] });
    } else {
      // iterate through subscribed vehicle list
      console.log("vehicleTopics", user.subscribedVehicleTipics);

      let flag = false;
      await user.subscribedVehicleTipics.map((obj, i) => {
        if (obj.topic == topic) {
          flag = true;
        }
      });

      if (flag == true) {
        // meka map eka athulata danna balanna

        return res.status(400).json({
          msg: `You have alrady subscribed to ${makeName}_${modelName}`,
        });
      } else {
        const subscribedVehicleTipicsObj = {
          topic: `${makeName}_${modelName}`,
          makeName: makeName,
          modelName: modelName,
          firebaseId: firebaseId,
        };

        if (user.subscribedVehicleTipics.length > 2) {
          console.log("long");
          user.subscribedVehicleTipics.shift();

          // subscribe to topic

          const result = await topicFunction.subscribedtotopic(
            subscribedVehicleTipicsObj
          );

          console.log("result ", result);

          if (result == 0) {
            // update user and send response
            user.subscribedVehicleTipics.push(subscribedVehicleTipicsObj);
            await user.save();
            return res.status(200).json({
              msg: `you have sussessfully subscribed to ${makeName}_${modelName}`,
            });
          } else {
            return res.status(400).json({
              msg: `there is an error in subscribing`,
            });
          }
        } else {
          console.log("short");

          const result = await topicFunction.subscribedtotopic(
            subscribedVehicleTipicsObj
          );

          if (result == 0) {
            //   update user and send response
            user.subscribedVehicleTipics.push(subscribedVehicleTipicsObj);
            await user.save();
            return res.status(200).json({
              msg: `you have sussessfully subscribed to ${makeName} ${modelName}`,
            });
          } else {
            return res.status(400).json({
              msg: `there is an error in subscribing`,
            });
          }

          //   user.subscribedVehicleTipics.unshift(subscribedVehicleTipicsObj);
        }
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.unSubscribeToTopic = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // see if user exists
    let user = await User.findById(req.user.id);

    if (!user) {
      res.status(400).json({ errors: [{ msg: "There is no user" }] });
    } else {
      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $pull: {
            subscribedVehicleTipics: {
              topic: req.body.topic,
            },
          },
        }
      );
      res
        .status(200)
        .json({ msg: `Unsubscribe ${req.body.topic} topic successfully` });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// get subscribed list
exports.subscibeList = async (req, res) => {
  try {
    // see if user exixts
    let user = await User.findById(req.user.id);
    console.log(req.user.id);
    if (!user) {
      console.log("There is no user");
      res.status(400).json({ errors: [{ msg: "There is no user" }] });
    } else {
      // send the subscribe list

      const subscribedVehicleTipics = user.subscribedVehicleTipics;

      return res
        .status(200)
        .json({ subscribedVehicleTipics: subscribedVehicleTipics });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
};

// load notifications

exports.loadvehicleNotifications = async (req, res) => {
  console.log("Loading last 30 vehicle notifications");
  try {
    const user = await User.findById({ _id: ObjectId(req.user.id) });

    if (!user) {
      console.log("There is no user");
      res.status(400).json({ errors: [{ msg: "There is no user" }] });
    } else {
      // iterate through subscribed vehicle list
      console.log("vehicleTopics", user.subscribedVehicleTipics[2]);
      NotificationList = [];

      if (user.subscribedVehicleTipics.length == 0) {
        return res.status(404).json({
          msg: `You have not subscribe to vehicle market`,
        });
      } else {
        // user.subscribedVehicleTipics.map(async (obj, i) =>
        let notification = [];
        let topics = [];
        for (obj of user.subscribedVehicleTipics) {
          topics.push(obj.topic);
        }

        console.log("Topic list", topics);

        let newsList = await Notification.find({
          category: "vehicleMarket",
          topic: { $in: topics },
        })
          .sort({ $natural: -1 })
          .limit(30);

        // time difference
        const currentDate = Date.now();
        newsList.forEach(function (newsObj) {
          let newsobject = newsObj;

          let diffInMilliSeconds =
            Math.abs(currentDate - newsobject.date) / 1000;

          // calculate hours
          const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
          diffInMilliSeconds -= hours * 3600;
          // console.log("calculated hours", hours);

          // calculate minutes
          const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
          diffInMilliSeconds -= minutes * 60;
          // console.log("minutes", minutes);

          if (hours <= 0) {
            newsobject.timeDifference = `${minutes} min ago`;
          } else {
            newsobject.timeDifference = `${hours} Hour & ${minutes} min ago`;
          }

          // console.log(newsobject);
          notification.push(newsobject);
        });

        res.status(200).json({ NotificationList: notification });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};
