var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');
var crypto = require('../libs/hashing');
var secretKeys = require('../config/secret.keys.js');

passport.use(new LocalStrategy(
	{ usernameField: "userName", passwordField: "password" },
    function(username, password, done) {
        var userName = crypto.encrypt(username.toLowerCase(), secretKeys.userName);
        var password = crypto.encrypt(password, secretKeys.password);
        User.findOne({ userName: userName }, function(err, user) {
            if (err) {
                console.log("Error in login");
                throw err;
            }
            if (!user) {
		        return done(null, false, { message: 'Incorrect username.' });
		    }
		    if (password != user.password) {
		        return done(null, false, { message: 'Incorrect password.' });
		    }
		    return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

module.exports = {
	signinPage: (req, res, next) => {
		res.status(200).send({ "title": "Login to system." });
	},

	authenticate: passport.authenticate('local'),

	userInfo: (req,  res, next) => {
		res.send("Login successful.");
	},

	logout: (req, res, next) => {
		req.logout();
    	req.flash('success_msg', 'You are logged out');
    	res.redirect('/login');
	}
}

/********************************/