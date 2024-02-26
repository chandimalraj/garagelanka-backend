const config = require("config");
var ObjectId = require("mongodb").ObjectID;
var admin = require("firebase-admin");
const Topic = require("../../../models/VehicleMarketTopics");
const firebase = require("../../../config/firebase");
const Notification = require("../../../models/Notifications");

// let serviceAccount = require("../../config/garage-lanka-firebase-adminsdk-w7kl4-a5afbbcb70.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

exports.subscribedtotopic = async (obj) => {
  try {
    const topicDoc = await Topic.findOne({ topic: obj.topic });

    const topic = obj.topic;
    // console.log("topic param", topic);
    console.log("topic Doc", topicDoc);
    const registrationTokens = [
      "fU02KgvhRCCbOEB_c1cU4F:APA91bEmJNqgdRZk-IIdm5RK98QFF82beNbt-4Wf7Vkmp0Gu0SkfvapA3WfdXupCrk2GYLwvp3w8yeHEBR9_lydCp7ounWyGOagdvZjOhicg50J-PoYtDEEGB-FLMN8grcwlaz-gOEHK",
    ];

    if (topicDoc) {
      console.log("Topic is alrady exsist");

      const response1 = await admin
        .messaging()
        .subscribeToTopic(registrationTokens, topic);

      console.log("Successfully subscribed to topic:", response1);

      return response1.failureCount;

      //   subscribe user
    } else {
      console.log("Topic isn't exsist creating new one");

      // create topic(done by library)
      //   update topic model
      //   subscribe user

      const response1 = await admin
        .messaging()
        .subscribeToTopic(registrationTokens, topic);

      console.log("Successfully subscribed to topic:", response1);

      return response1.failureCount;
    }
  } catch (error) {
    console.error(error.message);
    return "there is an error in subscribing to topic";
  }
};

exports.sendNotificationstoTopic = async (obj) => {
  try {
    const { topic, district, userObj } = obj;
    console.log("Topic", topic);
    const contactNo = userObj.contactNo;

    // Constructing Date

    date = new Date();

    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }

    const time = date.toLocaleTimeString("en", {
      timeStyle: "short",
      hour12: false,
      timeZone: "Asia/Colombo",
    });

    const day = year + "-" + month + "-" + dt;

    // console.log("Topic", topic);

    // constructing messgae

    const message = {
      notification: {
        title: `${topic} For Sale In Garage Lanka`,
        body: `A user has listed a ${topic} for sale from ${district} on garage lanka on ${day} ${time}  Phone ${contactNo} `,
      },
    };

    const options = {
      priority: "high",
      timeToLive: 60 * 60 * 24,
    };

    const response = await admin
      .messaging()
      .sendToTopic(topic, message, options);
    console.log("Successfully send message to topic", response);

    // save notification to db

    let notificationreq = {
      title: `${topic} For Sale In Garage Lanka`,
      body: `A user has listed a ${topic} for sale from ${district} on garage lanka on ${day} ${time}  Phone ${contactNo} `,
      topic: `${topic}`,
      category: `vehicleMarket`,
    };

    const notification = new Notification(notificationreq);
    date = new Date();

    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }

    notification.day = day;
    notification.time = time;

    await notification.save();

    return response.failureCount;
  } catch (error) {
    console.error(error.message);
    return "there is an error in subscribing to topic";
  }
};
