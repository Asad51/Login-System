var app = require("express")();

/******* User Module  ***********/
/*******************************/
var User = require('../models/users');
var crypto = require('../libs/hashing');
var secretKeys = require('../config/secret.keys.js');

var signup = require('../controllers/signup.js');
var signin = require('../controllers/signin.js');
var dashboard = require('../controllers/dashboard.js');
var authenticate = require('../controllers/authenticate.js');

/******* User Registration ****************/
/******************************************/
app.route('/signup')
    .get(signup.signupPage)
    .post(authenticate.ensureAuthenticated, signup.userInfo);

/*** Checking Existence of User ***/
/**********************************/
app.route('/check-user')
    .post(signup.userCheck);

/************ User Login **********/
/**********************************/
app.route('/signin')
    .get(signin.signinPage)
    .post(authenticate.ensureAuthenticated, signin.authenticate, signin.userInfo);

/*********** Dashboard ***********/
/*********************************/
app.get("/dashboard", dashboard.ensureAuthenticated, dashboard.details);

/******** Logout *****************/
/*********************************/
app.route('/signout')
	.get(signin.signout);


module.exports = app;

/**********************************/