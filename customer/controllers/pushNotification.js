const Notification = require("../../models/Notifications");
const UserTraffic = require("../../models/UserTrafficofApp");

// get service Centers

exports.loadLastNews = async (req, res) => {
  console.log("Loading last 10 news alerts");
  try {
    let news = [];

    let newsList = await Notification.find({ category: "NEWS" })
      .sort({ $natural: -1 })
      .limit(15);

    // time difference
    const currentDate = Date.now();
    newsList.forEach(function (newsObj) {
      let newsobject = newsObj;

      let diffInMilliSeconds = Math.abs(currentDate - newsobject.date) / 1000;

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
      news.push(newsobject);
    });

    // user traffic counter

    let userTraffic = await UserTraffic.findOne({ part: "NEWS" });
    userTraffic.traffic = userTraffic.traffic + 1;

    console.log("User traffic", userTraffic);

    await userTraffic.save();

    res.status(200).json({ news: news });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};
