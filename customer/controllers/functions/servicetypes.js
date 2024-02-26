const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const ServiceCenter = require("../../../models/ServiceCenter");

exports.getserviceTypeDetailsofaServiceCenter = async (
  serviceCenterID,
  servicetypeId
) => {
  try {
    const serviceCenter = await ServiceCenter.findById({
      _id: ObjectId(serviceCenterID),
    });

    if (!serviceCenter) {
      return "There is no service center";
    } else {
      if (serviceCenter.servicesOffered.length == 0) {
        return "There is no service types offer by this service center";
      } else {
        let selectedServiceType = serviceCenter.servicesOffered.find(
          (o) => o.serviceTypeId == servicetypeId
        );
        const serviceTypeDetails = { selectedServiceType };
        serviceTypeDetails.servicCenterOpenTime = serviceCenter["openTime"];
        serviceTypeDetails.servicCenterCloseTime = serviceCenter["closeTime"];

        // console.log("service type details", serviceTypeDetails);

        return serviceTypeDetails;
      }
    }
  } catch (error) {
    console.error(error.message);
    return "there is no service type found";
  }
};
