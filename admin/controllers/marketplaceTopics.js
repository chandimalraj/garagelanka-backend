var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const User = require("../../models/User");
const topicFunction = require("../controllers/functions/topics");

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
    return res.status(200).json({ msg: "Vehicle registered Successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
