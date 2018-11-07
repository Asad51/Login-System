var express = require("express");
var router = express.Router();

var User = require('../models/users');

router.get('/', function(req, res) {
	User.find({}, function(err, users) {
		if (err) {
			res.send("Database Error");
		} else {
			res.send("Total number of users is " + users.length);
		}
	});
	console.log(req.signedCookies);
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}

module.exports = router;
