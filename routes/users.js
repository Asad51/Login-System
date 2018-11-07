var app = require("express")();

/******* User Module  ***********/
/*******************************/
var User = require('../models/users');
var crypto = require('../libs/hashing');
var secretKeys = require('../config/secret.keys.js');

var signup = require('../controllers/signup.js');
var signin = require('../controllers/signin.js');
var dashboard = require('../controllers/dashboard.js');

/******* User Registration ****************/
/******************************************/
app.route('/signup')
    .get(signup.signupPage)
    .post(signup.userInfo);

/****** User Checking *************/
/**********************************/
app.route('/check-user')
    .post(signup.userCheck);

/************ User Login **********/
/**********************************/
app.route('/signin')
    .get(signin.signinPage)
    .post(signin.authenticate, signin.userInfo);

/*********** Dashboard ***********/
/*********************************/
//app.get("/dashboard", );

/******** Logout *****************/
/*********************************/
app.get('logout', signin.logout);

module.exports = app;
/**********************************/