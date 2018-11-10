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
	console.log(req.isAuthenticated());
	console.log(req.session.id);
});

module.exports = router;

/**********************************/