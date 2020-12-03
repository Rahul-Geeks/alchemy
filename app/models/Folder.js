const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let FolderSchema = new Schema({
    'name': String,
    'home': Boolean,
    'child_folders': [{ type: ObjectId, 'ref': 'Folder' }],
    'child_files': [{ type: ObjectId, 'ref': 'File' }]
});

module.exports = mongoose.model("Folder", FolderSchema);