var express = require("express");
var router = express.Router();

var User = require('../models/users');

var emailKey = "^5F&hs";
var userNameKey = "Uf%f2";

router.get('/', function(req, res, next) {
    res.status(200).send("Home Page");
});

module.exports = router;