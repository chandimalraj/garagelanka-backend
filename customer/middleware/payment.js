const moment = require("moment");

module.exports = function (req, res, next) {
  const user = req.user;

  const paymentExpiryDate = moment(user.paymentExpire);
  const now = moment(new Date());

  const daysToExpire = paymentExpiryDate.diff(now, "days");

  if (daysToExpire <= 0)
    return res.status(403).json({ msg: "Payment Expired" });

  next();
};
