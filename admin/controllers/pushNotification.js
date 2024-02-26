const { validationResult } = require("express-validator");
const admin = require("../../config/firebase-config");
const Notification = require("../../models/Notifications");

var FCM = require("fcm-node");

exports.sendnotifications = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { title } = req.body;
  const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };

  // The topic name can be optionally prefixed with "/topics/".
  // const topic = "highScores";

  // const message = {
  //   data: {
  //     score: "850",
  //     time: "2:45",
  //   },
  //   topic: topic,
  // };

  const registrationToken =
    "cGQfgX1uSkOEsdwBzWSuUW:APA91bElCtnfAlU3qjGO7YzbguQQ3dI8uMkVdYzJL7uOKHCEdshUqNpFeDEoqxW6YZlalk4nVtwGbfFRem4bDOJD5TDgxzoB";

  const message = {
    data: {
      score: "850",
      time: "2:45",
    },
    token: registrationToken,
  };

  try {
    // const options = notification_options;
    // admin
    //   .messaging()
    //   .sendToDevice(registrationToken, message, options)
    //   .then((response) => {
    //     // Response is a message ID string.
    //     console.log("Successfully sent message:", response);
    //   })
    //   .catch((error) => {
    //     console.log("Error sending message:", error);
    //   });

    // Save notification part
    notificationreq = req.body;

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

    const time = date.toLocaleTimeString("en", {
      timeStyle: "short",
      hour12: false,
      timeZone: "Asia/Colombo",
    });

    const day = year + "-" + month + "-" + dt;
    // console.log("Date", nowDate);
    notification.day = day;
    notification.time = time;

    await notification.save();

    res.status(200).send("notification saved sussessfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// get service Centers
exports.getnewsnotifications = async (req, res) => {
  try {
    await Notification.find(function (err, result) {
      if (err) return next(err);
      res.json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

exports.updateNews = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { id, title, body, topic, category } = req.body;

  try {
    let news = await Notification.findById(id);

    news.title = title;
    news.body = body;
    news.topic = topic;
    news.category = category;

    await news.save();

    res.status(200).send(`News has been updated successfully`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.deleteNews = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { id } = req.body;

  try {
    await Notification.findOneAndDelete({ _id: id });

    res.status(200).send(`News has been deleted successfully`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.loadLastNews = async (req, res) => {
  console.log("Loading last 10 news alerts");
  try {
    let news = await Notification.find({ category: "NEWS" })
      .sort({ $natural: -1 })
      .limit(10);

    res.status(200).json({ news: news });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

exports.sendpushNotification = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    console.log("notification");

    // var serverKey =
    //   "AAAABublDAY:APA91bEZE9dLFj3la3KpSJlmWDYuie6kD28nqmliHK7zbJYh__Eoli6a0Xz4w6W39ecCsHgcdQZUlQakycPYG5IXW5m9cBjxh0w7BJdn68CGJUwTCYgP5bhB3-f8cpaKhvICcXPcrQfO"; //put your server key here
    // var fcm = new FCM(serverKey);

    // var message = {
    //   //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    //   to: "cGQfgX1uSkOEsdwBzWSuUW:APA91bF9vv5_1dhiiOOuFjcyeD_PhGPvcO7hHPVS3QUQFVl",
    //   collapse_key: "News Alert",

    //   notification: {
    //     title: "Title of your push notification",
    //     body: "Body of your push notification",
    //   },

    //   // data: {
    //   //   //you can send only notification or only data(or include both)
    //   //   my_key: "my value",
    //   //   my_another_key: "my another value",
    //   // },
    // };

    // fcm.send(message, function (err, response) {
    //   if (err) {
    //     console.log("Something has gone wrong!", err);
    //   } else {
    //     console.log("Successfully sent with response: ", response);
    //   }
    // });

    res.status(200).send("notification saved sussessfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
