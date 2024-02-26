const express = require("express");
const connectDB = require("./config/db");
const app = express();
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

// web socket

var httpServer = require("http").createServer(app);
const options = {
  /* ... */
};
const io = require("socket.io")(httpServer, options);
// Connect Database
connectDB();

// enable cross
app.use(cors());

//  set server time out

app.timeout = 120000;

// Initialize The Middleware
// app.use(morgan("dev"));
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

// Define Routes

// Customer routes
// app.use("/customer/api/host", require("./customer/routes/api/host"));
app.use(
  "/customer/api/serviceCenters",
  require("./customer/routes/api/serviceCenters")
);

app.use("/customer/api/vehicles", require("./customer/routes/api/vehicles"));
app.use("/customer/api/bookings", require("./customer/routes/api/bookings"));
app.use("/customer/api/payment", require("./customer/routes/api/payment"));

app.use("/customer/api/img", require("./customer/routes/api/mobileaAppImages"));
app.use(
  "/customer/api/servicetypes",
  require("./customer/routes/api/serviceTypes")
);
app.use(
  "/customer/api/servicerecords",
  require("./customer/routes/api/serviceRecords")
);
app.use("/customer/api/images", require("./customer/routes/api/images"));
app.use("/customer/api/parts", require("./customer/routes/api/parts"));
app.use("/customer/api/order", require("./customer/routes/api/order"));
app.use("/customer/api/message", require("./customer/routes/api/message"));

// Vehicle market

app.use("/customer/api/cities", require("./customer/routes/api/cities"));
app.use("/customer/api/districts", require("./customer/routes/api/districts"));
app.use("/customer/api/users/", require("./customer/routes/api/users"));
app.use("/customer/api/auth", require("./customer/routes/api/auth"));
app.use("/customer/api/otp", require("./customer/routes/api/otp"));
app.use("/customer/api/make", require("./customer/routes/api/make"));
app.use(
  "/customer/api/vehiclemodel",
  require("./customer/routes/api/vehicleModels")
);
app.use("/customer/api/province", require("./customer/routes/api/province"));
app.use(
  "/customer/api/marketplace",
  require("./customer/routes/api/marketplace")
);
app.use(
  "/customer/api/marketplaceaddreport",
  require("./customer/routes/api/marketplaceAddReport")
);
app.use(
  "/customer/api/marketplacetopic",
  require("./customer/routes/api/vehicleMarketplaceTopic")
);

app.use(
  "/customer/api/vehicletypes",
  require("./customer/routes/api/vehicleTyepes")
);
app.use(
  "/customer/api/vehiclecondition",
  require("./customer/routes/api/vehicleCondition")
);
app.use(
  "/customer/api/vehiclemanufacturedyear",
  require("./customer/routes/api/vehicleManufacturedYear")
);

// uedwa

app.use("/customer/api/uedwa", require("./customer/routes/api/ueftd"));

app;

// vehicle

// fuel finder
app.use("/customer/api/fueltypes", require("./customer/routes/api/fuelType"));
app.use(
  "/customer/api/fuelfinder",
  require("./customer/routes/api/fuelFinder")
);
app.use("/customer/api/firebase", require("./customer/routes/api/firebase"));
app.use(
  "/customer/api/notifications",
  require("./customer/routes/api/notification")
);
app.use("/customer/api/comments", require("./customer/routes/api/comments"));
app.use(
  "/customer/api/fuelfinderimages",
  require("./customer/routes/api/mobileaAppImages")
);

// Garage routes

app.use("/garage/api/users/", require("./garage/routes/api/users"));
app.use("/garage/api/auth", require("./garage/routes/api/auth"));
app.use("/garage/api/otp", require("./garage/routes/api/otp"));
app.use(
  "/garage/api/serviceCenters",
  require("./garage/routes/api/ServiceCenter")
);
app.use("/garage/api/bookings", require("./garage/routes/api/bookings"));
app.use(
  "/garage/api/servierecord",
  require("./garage/routes/api/serviceRecord")
);
app.use(
  "/garage/api/servicetypes",
  require("./garage/routes/api/serviceTypes")
);
app.use("/garage/api/instantBill", require("./garage/routes/api/instantBill"));
app.use("/garage/api/district", require("./garage/routes/api/districts"));
app.use(
  "/garage/api/salesRecords",
  require("./garage/routes/api/salesRecords")
);
app.use("/garage/api/parts", require("./garage/routes/api/parts"));
app.use("/garage/api/servicebill", require("./garage/routes/api/serviceBill"));
app.use("/garage/api/instantbill", require("./garage/routes/api/instantBill"));
app.use("/garage/api/district", require("./garage/routes/api/districts"));
app.use(
  "/garage/api/items-expense-bill",
  require("./garage/routes/api/itemExpenseBill")
);
app.use(
  "/garage/api/service-expense-bill",
  require("./garage/routes/api/serviceExpenseBill")
);
app.use("/garage/api/leavetypes", require("./garage/routes/api/leaveTypes"));
app.use("/garage/api/expense", require("./garage/routes/api/expense"));
app.use("/garage/api/employees", require("./garage/routes/api/employees"));
app.use("/garage/api/supplier", require("./garage/routes/api/supplier"));
app.use("/garage/api/customer", require("./garage/routes/api/customer"));
app.use("/garage/api/make", require("./garage/routes/api/make"));
app.use(
  "/garage/api/vehiclemodel",
  require("./garage/routes/api/vehicleModels")
);
// app.use("/garage/api/pdf", require("./garage/routes/api/pdf"));
app.use(
  "/garage/api/salesRecords",
  require("./garage/routes/api/salesRecords")
);
app.use("/garage/api/orders", require("./garage/routes/api/orders"));
app.use(
  "/garage/api/customeruser",
  require("./garage/routes/api/coustomeruser")
);
// app.use("/garage/api/userroles", require("./garage/routes/api/userRole"));
app.use("/garage/api/payment", require("./garage/routes/api/payment"));
app.use("/garage/api/fueltypes", require("./garage/routes/api/fuelType"));
app.use("/garage/api/fuelstation", require("./garage/routes/api/fuelStation"));
app.use(
  "/garage/api/fuelstationauth",
  require("./garage/routes/api/fuelStationAuth")
);
app.use(
  "/garage/api/fuelstationfirebase",
  require("./garage/routes/api/firebase")
);
app.use("/garage/api/inventory", require("./garage/routes/api/inventory"));

// Garage Admin

app.use("/admin/api/cities", require("./admin/routes/api/cities"));
app.use("/admin/api/districts", require("./admin/routes/api/districts"));
app.use("/admin/api/users/", require("./admin/routes/api/adminUusers"));
app.use("/admin/api/auth", require("./admin/routes/api/auth"));
app.use(
  "/admin/api/usercontroller",
  require("./admin/routes/api/userController")
);
app.use(
  "/admin/api/garageusercontroller/",
  require("./admin/routes/api/garageUserController")
);
app.use("/admin/api/leavetypes", require("./admin/routes/api/leaveTypes"));
// app.use(
//   "/admin/api/serviceCenters",
//   require("./admin/routes/api/serviceCenters")
// );
app.use("/admin/api/servicetypes", require("./admin/routes/api/serviceTypes"));
app.use("/admin/api/fueltypes", require("./admin/routes/api/fuelType"));
app.use("/admin/api/cities", require("./admin/routes/api/cities"));
app.use("/admin/api/districts", require("./admin/routes/api/districts"));

app.use("/admin/api/vehicletypes", require("./admin/routes/api/vehicleTyepes"));
app.use("/admin/api/fuelstations", require("./admin/routes/api/fuelStation"));

app.use("/admin/api/news", require("./admin/routes/api/pushNotification"));

app.use(
  "/admin/api/notification",
  require("./admin/routes/api/pushNotification")
);
// app.use("/admin/api/pushnotification", require("./admin/routes/api/sendpushnotification"));

// mobile app images

app.use(
  "/admin/api/mobileappimages",
  require("./admin/routes/api/mobileAppImages")
);
app.use("/admin/api/usertraffic", require("./admin/routes/api/userTraffic"));

// Markatplace
app.use("/admin/api/marketplace", require("./admin/routes/api/marketplace"));
app.use(
  "/admin/api/marketplaceaddreport",
  require("./admin/routes/api/marketplaceAddReport")
);
app.use(
  "/admin/api/marketplacetopic",
  require("./admin/routes/api/vehicleMarketplaceTopic")
);

app.use("/admin/api/vehicletypes", require("./admin/routes/api/vehicleTyepes"));
app.use(
  "/admin/api/vehiclecondition",
  require("./admin/routes/api/vehicleCondition")
);
app.use(
  "/admin/api/vehiclemanufacturedyear",
  require("./admin/routes/api/vehicleManufacturedYear")
);

// nilushika records
// app.use("/customer/api/svrrec", require("./customer/routes/api/serviceRecords"));

// serve statict assests in production

// if (process.env.NODE_ENV === "production") {
// }

// register error fixed

// io.on("connection", (socket) => {
//   socket.emit("welcome", "hello There and welcome to socket.io server");
//   console.log("New client is connected");
// });

//  port set
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
