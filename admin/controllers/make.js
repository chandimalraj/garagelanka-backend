const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
// bring user,vehicle models

const Make = require("../../models/Make");
// register vehicle meke model
exports.registermake = async(req, res) => {
    const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    try {
        //search for already registered vehicles in db
        // let make = await Make.findOne({ vehicleId: req.body.vehicleId });

        // if (vehicle) {
        //     console.log("Vehicle alrady registered : " + req.body.vehicleId);
        //     res.status(400).json({ errors: [{ msg: "Vehicle alrady registered" }] });
        // }

        const reqBody = req.body;

        console.log(reqBody);

        await reqBody.forEach(function(makecom) {
            const makeid = makecom.make_id;
            const name_en = makecom.name_en;

            // Build make Object
            const makeFields = {};
            makeFields.make_id = makeid;
            makeFields.name_en = name_en;

            //Add new make
            make = new Make(makeFields);

            make.save();
        });

        // reqBody.map(({ make_id }) => console.log(make_id));

        console.log("successfully");

        res.status(200).send("Successfully saved vehicle make model");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
};