const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let FileSchema = new Schema({
    'name': String,
    'home': Boolean
});

module.exports = mongoose.model("File", FileSchema);