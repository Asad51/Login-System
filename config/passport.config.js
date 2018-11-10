var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');
var crypto = require('../libs/hashing');
var secretKeys = require('./secret.keys.js');

passport.use(new LocalStrategy(
    { usernameField: "userName", passwordField: "password" },
    function(username, password, done) {
        var userName = crypto.encrypt(username.toLowerCase(), secretKeys.userNameKey, secretKeys.userNameIV);
        User.findOne({ userName: userName }, function(err, user) {
            if (err) {
                console.log("Error in login");
                throw err;
            }
            if (!user) {
                console.log("Incorrect username.")
                return done(null, false, { message: 'Incorrect username.' });
            }
            user.password = crypto.decrypt(user.password, secretKeys.passwordKey);
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

module.exports = passport;

/*******************************************/