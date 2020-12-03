require("./app/models/db.conn");

const express = require("express");
const mongoose = require("mongoose");
const async = require("async");
const bodyParser = require("body-parser");

const Folder = mongoose.model("Folder");
const File = mongoose.model("File");

const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,x-access-token, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));

app.get("/api/home", (req, res) => {
    async.parallel([
        (callback) => {
            Folder.find({ "home": true }).exec((error, folders) => callback(error, folders));
        },

        (callback) => {
            File.find({ "home": true }).exec((error, files) => callback(error, files));
        }
    ], (error, results) => {
        if (error)
            res.status(500).json({ 'message': 'Error while getting files and folders', 'error': error });
        else {
            res.status(200).json({ 'folders': results[0], 'files': results[1] });
        }
    });
});

app.get("/api/folder", (req, res) => {
    Folder.findById(req.query.folderId).populate('child_folders').populate('child_files').exec((error, folderObj) => {
        if (error)
            res.status(500).json({ 'message': 'Error while getting a folder', 'error': error });
        else {
            res.status(200).json(folderObj);
        }
    });
});

app.post("/api/file", (req, res) => {

    async.waterfall([
        (callback) => {
            let newFile = {
                'name': req.body.name,
                'home': req.body.home
            };

            File.create(newFile, (error, fileObj) => callback(error, fileObj));
        },

        (fileObj, callback) => {
            Folder.findByIdAndUpdate(req.query.folderId, { "$addToSet": { "child_files": fileObj._id } })
                .exec((error, folderObj) => callback(error, folderObj));
        }
    ], (error, folderObj) => {
        if (error)
            res.status(500).json({ 'message': 'Error while creating a file', 'error': error });
        else {
            res.status(200).json(folderObj);
        }
    });
});


app.post("/api/folder", (req, res) => {

    async.waterfall([
        (callback) => {
            let newFolder = {
                'name': req.body.name,
                'home': req.body.home
            };

            Folder.create(newFolder, (error, newFolderObj) => callback(error, newFolderObj));
        },

        (newFolderObj, callback) => {
            if (req.query.folderId && req.query.folderId != "undefined")
                Folder.findByIdAndUpdate(req.query.folderId, { "$addToSet": { "child_folders": newFolderObj._id } })
                    .exec((error, folderObj) => {
                        console.log("ERROR", error);
                        callback(error, folderObj, newFolderObj)
                    });
            else {
                callback(null, null, newFolderObj);
            }
        }
    ], (error, folderObj, newFolderObj) => {
        if (error)
            res.status(500).json({ 'message': 'Error while creating a file', 'error': error });
        else {
            res.status(200).json(newFolderObj);
        }
    });
});

app.get("/api/search", (req, res) => {
    async.parallel([
        (callback) => {
            Folder.find({ "name": { "$regex": req.query.value, "$options": "i" } }, { "name": 1 }).exec((error, folders) => callback(error, folders));
        },

        (callback) => {
            File.find({ "name": { "$regex": req.query.value, "$options": "i" } }, { "name": 1 }).exec((error, files) => callback(error, files));
        }
    ], (error, results) => {
        if (error)
            res.status(500).json({ 'message': 'Error while getting a files and folders', 'error': error });
        else {
            res.status(200).json({ 'folders': results[0], 'files': results[1] });
        }
    });
});

app.listen(8000, '127.0.0.1', (error) => {
    if (error)
        console.log("ERROR WHILE STARTING THE APP", error);
    else {
        console.log("Connected with server at port 8000");
    }
});