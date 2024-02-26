const Notification = require("../../models/Notifications");
const Comment = require("../../models/comments");
const { validationResult } = require("express-validator");
const { randomHexColor } = require("random-hex-color-generator");
var ObjectId = require("mongodb").ObjectID;

// get comments

exports.loadCommentsbyNews = async function (req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    try {
      const notification = req.query.notification;
      const comments = await Comment.find({
        notification: ObjectId(notification),
      });

      return res.status(200).json({ comments: comments });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
};

// get news and comments

exports.loadNewsAndComments = async function (req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    try {
      const notification = req.query.notification;
      const currentDate = Date.now();

      const newsObj = await Notification.findOne({
        _id: ObjectId(notification),
      });

      let news = newsObj;

      let diffInMilliSeconds = Math.abs(currentDate - news.date) / 1000;

      // calculate hours
      const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
      diffInMilliSeconds -= hours * 3600;
      // console.log("calculated hours", hours);

      // calculate minutes
      const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
      diffInMilliSeconds -= minutes * 60;
      console.log("minutes", minutes);

      if (hours <= 0) {
        news.timeDifference = `${minutes} min ago`;
      } else {
        news.timeDifference = `${hours} Hour & ${minutes} min ago`;
      }

      // coments

      let comments = [];
      const commentslist = await Comment.find({
        notification: ObjectId(notification),
      });

      commentslist.forEach(function (commentObj) {
        let comment = commentObj;

        let diffInMilliSeconds = Math.abs(currentDate - comment.date) / 1000;

        // calculate hours
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;
        // console.log("calculated hours", hours);

        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
        diffInMilliSeconds -= minutes * 60;
        console.log("minutes", minutes);

        if (hours <= 0) {
          comment.timeDifference = `${minutes} min ago`;
        } else {
          comment.timeDifference = `${hours} Hour & ${minutes} min ago`;
        }

        console.log("time differene ", comment.timeDifference);

        console.log(comment);
        comments.push(comment);
      });

      return res.status(200).json({ news: news, comments: comments });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
};

// Add comments

exports.addComment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    try {
      //Add service record to DB

      const { firstName, lastName, id } = req.user;
      const name = `${firstName} ${lastName}`;

      const notification = req.query.notification;
      const body = req.query.body;
      console.log(body);

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

      //   genarate color

      let color = randomHexColor();

      color = color.substring(1);
      color = `0xFF${color}`;

      console.log("comment color", color);

      const comment = new Comment();

      comment.user = id;
      comment.notification = notification;
      comment.userName = name;
      comment.body = body;
      comment.day = day;
      comment.time = time;
      comment.color = color;

      await comment.save();

      // update the notification

      const notificationDoc = await Notification.findOne({
        _id: ObjectId(notification),
      });

      if (!notificationDoc) {
        console.log("There is no Notification");
        res
          .status(400)
          .json({ errors: [{ msg: "There is no News to Update" }] });
      } else {
        notificationDoc.numberofComments = notificationDoc.numberofComments + 1;

        console.log("number of comments", notificationDoc.numberofComments);
        await notificationDoc.save();
      }

      res.status(200).send("comment Added Sussessfully");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
};
