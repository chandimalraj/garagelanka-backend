const { validationResult } = require("express-validator");
// const admin = require("../config/firebase-config");
const Notification = require("../../models/Notifications");
// var FCM = require("fcm-node");
var admin = require("firebase-admin");

let serviceAccount = require("../config/garage-lanka-firebase-adminsdk-w7kl4-a5afbbcb70.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendpushNotification = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    console.log("notification");

    const registrationToken =
      "cBxDMILHSOS9HB_v3FfHMc:APA91bGT5jtEptReg4xTClmQS-Sbg9e0BcWFbBHhbbOKdXVqlTZ2wJAAwrcqBhr1wE_hyj1KW0nbWNkkEAj5AAuSIzIO8LajJN3lvEnAKiE1wE4CAjSpT4KFxs6JkCX82caaDX4VdGcK";
    const message = {
      notification: {
        title: "Message From Garage Lanka",
        body: "Garage lanka Fuel Notificatios",
      },
    };

    const options = {
      priority: "high",
      timeToLive: 60 * 60 * 24,
    };
    admin
      .messaging()
      .sendToDevice(registrationToken, message, options)
      .then((response) => {
        console.log("response", response);
        res.status(200).send("Notification sent successfully");
      })
      .catch((error) => {
        console.log(error);
      });

    // res.status(200).send("notification saved sussessfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
