const { validationResult } = require("express-validator");
const Customer = require("../../../models/Customers");
var ObjectId = require("mongodb").ObjectID;

exports.addCustomertoServiceCenter = async (
  CustomerData,
  serviceCenterId,
  res
) => {
  try {
    CustomerData.serviceCenterId = serviceCenterId;

    const customer = await Customer.findOne({
      coustomerMobile: CustomerData.mobile,
      serviceCenterId: serviceCenterId,
    });

    if (customer) {
      return "Customer Already Exists";
    } else {
      // inetialize a new customer

      const garageCustomer = {};
      // const garageCustomerVehicle = {};

      // // initialize the custiomer vehicle
      // garageCustomerVehicle.make = CustomerData.vehicle.make;
      // garageCustomerVehicle.make_name = CustomerData.vehicle.make_name;
      // garageCustomerVehicle.model = CustomerData.vehicle.model;
      // garageCustomerVehicle.model_name = CustomerData.vehicle.model_name;
      // garageCustomerVehicle.registationNumber =
      //   CustomerData.vehicle.registationNumber;

      console.log("vehicle initialization done");
      coustomerName = `${CustomerData.firstName} ${CustomerData.lastName}`;
      // initialization of the customer data
      garageCustomer.serviceCenterId = serviceCenterId;
      garageCustomer.coustomerName = coustomerName;
      garageCustomer.coustomerMobile = CustomerData.mobile;
      // garageCustomer.vehicle = garageCustomerVehicle;

      console.log("customer inttialization done");

      const newCustomer = new Customer(garageCustomer);
      await newCustomer.save();
      return "successfully added user to the service center";
    }

    // return;
  } catch (error) {
    console.log(" add user to service center error");
    console.error(error.message);
    return "error in customer registation";
  }
};
