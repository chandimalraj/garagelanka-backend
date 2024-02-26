const ServiceRecord = require("../../../models/ServiceRecord");
const Booking = require("../../../models/Bookings");
const Vehicle = require("../../../models/Vehicle");

async function addServiceRecord(req, res) {
  const { bookingRef, serviceCenterId, billingDate, vehicle } = req.body;

  const user = req.user;

  if (serviceCenterId != user.serviceCenter._id) {
    console.log(
      " Cannot allow to add a billing due to this billing has not made by this service center : " +
        user.serviceCenter
    );
    return res.status(400).json({
      msg: "Cannot confirm blling due to this billing has not made by this service center",
    });
  }
  //if booking reference is available check whether billing done by the service center which placed the booking
  if (bookingRef) {
    console.log("booking ref", bookingRef);
    const booking = await Booking.findById(bookingRef);
    if (!booking) {
      return res.status(400).json({
        msg: "Invalid booking",
      });
    }
    if (booking.serviceCenterID != user.serviceCenter._id) {
      console.log(
        " Cannot confirm billing due to this billing has not made by for the service center : " +
          booking.service_center_id
      );
      return res.status(400).json({
        msg: "Cannot confirm billing due to this billing has not made by for the service center which placed the booking",
      });
    }
  }

  const newServiceRecord = new ServiceRecord(req.body);

  const serviceRecord = await newServiceRecord.save();

  if (vehicle) {
    const vehicleResult = await Vehicle.findById(vehicle);
    if (vehicleResult) {
      let records = vehicleResult.serviceRecords;
      records.push(serviceRecord._id);
      vehicleResult.serviceRecords = records;

      await vehicleResult.save();
    }
  }

  res.status(200).json({ msg: "Service Record Successfully Added" });
}

module.exports = {
  addServiceRecord,
};
