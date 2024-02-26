const path = require("path");
const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const serviceRecordsController = require("../../controllers/serviceRecords");

// @route   GET /api/serviceCenters.
// @desc    get all service records
// @access  Public

router.get("/user", auth, serviceRecordsController.getServiceRecordsByUser);

router.get("/record/:id", auth, serviceRecordsController.getServiceRecordById);

router.get(
  "/getservicerecordsbyvehicleId",
  auth,
  serviceRecordsController.getServiceRecordsByVehicleId
);

// router.get("/", serviceRecordsController.loadAllSearviceRecords);

router.get(
  "/booking/:id",
  auth,
  serviceRecordsController.getServiceRecordsByBookingId
);

/* sample req
{
"booking_ref":"2342342342",
"service_date":"2020-11-03",
"item_list":[    
    {"item_code":"345", "desc":"Additional oil added", "unitPrice":"444", "qnt": "2" ,"total":"888"},    
    {"item_code":"121", "desc":"Additional oil added", "unitPrice":"34",  "qnt": "2" , "total":"102"},  
    {"item_code":"3212","desc":"Additional oil added", "unitPrice":"3455",  "qnt": "2" , "total":"3455"},    
    {"item_code":"444", "desc":"Additional oil added", "unitPrice":"766",  "qnt": "2" ,"total":"766"} ], 
"service_types":[    
    {"service_type":"2343242323", "serviceCost":"444", "numberOfHrs":"1","total":"444"},    
    {"service_type":"3242342324", "serviceCost":"34", "numberOfHrs":"2", "total":"68"},  
    {"service_type":"4343234233", "serviceCost":"3455", "numberOfHrs":"1", "total":"3455"},    
    {"service_type":"4343234365", "serviceCost":"766", "numberOfHrs":"1", "total":"766"} ], 
"total_amount":"423423.78",
"vehicle_id":"CAD-4567",
"description":"Added engine oil",
"mileage":"2342343242342"
}
*/
router.post(
  "/update",
  /*,auth,
     [
        body("booking_ref", "booking reference is required").not().isEmpty(),
        body("service_types", "service_types are required").not().isEmpty(),
        body("item_list", "item list is required").not().isEmpty(),
        body("service_date", "service_date is required").not().isEmpty(),
        body("total_amount", "total amount is required").not().isEmpty(),
        body("vehicle_id", "vehicle id is required").not().isEmpty(), //owner
        body("description", "description is required").not().isEmpty(), //owner
    ]*/ serviceRecordsController.updateServiceRecord
);

router.post(
  "/",
  /*,auth,
     [
        body("booking_ref", "booking reference is required").not().isEmpty(),
        body("service_types", "service_types are required").not().isEmpty(),
        body("item_list", "item list is required").not().isEmpty(),
        body("service_date", "service_date is required").not().isEmpty(),
        body("total_amount", "total amount is required").not().isEmpty(),
        body("vehicle_id", "vehicle id is required").not().isEmpty(), //owner
        body("description", "description is required").not().isEmpty(), //owner
    ]*/ serviceRecordsController.addServiceRecord
);

module.exports = router;
