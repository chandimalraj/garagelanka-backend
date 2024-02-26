const mongoose = require("mongoose");

//Add models to the system

const ModelSchema = new mongoose.Schema({
    make_id: {
        type: String,
    },
    model_id: {
        type: String,
    },
    name_en: {
        type: String,
    },
});

module.exports = Model = mongoose.model("model", ModelSchema);