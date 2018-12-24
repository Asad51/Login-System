var app = require("express")();

var signup = require('../controllers/signup.js');
var signin = require('../controllers/signin.js');
var dashboard = require('../controllers/dashboard.js');

app.route('/signup')
    .post(signup.userInfo);

app.route('/signin')
    .post(signin.authenticate, signin.userInfo);

app.get("/dashboard", dashboard.ensureAuthenticated, dashboard.details);

app.route('/signout')
    .get(signin.signout);

module.exports = app;
