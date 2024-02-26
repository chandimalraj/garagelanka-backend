var ObjectId = require("mongodb").ObjectID;
const Vehicle = require("../../../models/Vehicle");

exports.addPermission = async (vehicleId, sc_id, serviceCenterName) => {
  try {
    
    await Vehicle.findOneAndUpdate(
      { _id: ObjectId(vehicleId) },
      {
        $push: {
          allow: {
            serviceCenterId: sc_id,
            serviceCenterName: serviceCenterName,
          },
        },
      }
    );

    console.log("in vehicle function add");
    return true;
  } catch (error) {
    return false;
  }
};

exports.removePermission = async (vehicleId, sc_id) => {
  try {
    await Vehicle.findOneAndUpdate(
      { _id: ObjectId(vehicleId) },
      { $pull: { allow: { serviceCenterId: sc_id } } }
    );
    console.log("in vehicle function remove");
    return true;
  } catch (error) {
    return false;
  }
};
