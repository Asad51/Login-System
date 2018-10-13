var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

var config = require('./config/config.js');
var dbUrl = config.db.db_url;
var port = process.env.PORT || config.app.port;

var app = express();
var connection = mongoose.connection;

app.listen(port, function(err) {
    if (err) {
        console.log("Server can't listen at port " + port);
    } else {
        console.log("Server running at port " + port);
        mongoose.connect(dbUrl, function(err) {
            if (err) {
                console.log("Can't connect database");
            } else {
                console.log("Database connected");
            }
        });
    }
});