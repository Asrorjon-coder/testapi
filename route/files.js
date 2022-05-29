const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();
const multer = require('multer');
// This will help us connect to the database
//const dbo = require("../db/conn");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'file')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.originalname)
    }
})
const upload = multer({
    storage: storage
})

router.post('/setavatar', upload.single('file'), (req, res) => {
    res.send("file has been uploaded successfully");
});

module.exports = router;