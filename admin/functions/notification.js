const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const Notification = require("../models/Notifications");

exports.saveNotification = async (notificationparam) => {
  try {
    const notification = new Notification(notificationparam);

    await notification.save();

    if (!serviceCenter) {
      return "There is no service center";
    } else {
      if (serviceCenter.servicesOffered.length == 0) {
        return "There is no service types offer by this service center";
      } else {
        let selectedServiceType = serviceCenter.servicesOffered.find(
          (o) => o.serviceTypeId == servicetypeId
        );
        console.log("service type", selectedServiceType);
        return selectedServiceType.maximumParallel;
      }
    }
  } catch (error) {
    console.error(error.message);
    return "there is no service type found";
  }
};
