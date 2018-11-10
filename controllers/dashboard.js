var crypto = require('../libs/hashing.js');

var User = require('../models/users.js');
var secretKeys = require('../config/secret.keys.js');

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error_msg','You are not logged in');
            res.redirect('/signin');
        }
    },

    details: function(req, res, next) {
        var userid = req.user.id;
        User.findById(userid, function(err, user) {
            if (err) {
                res.send("Error in finding user.");
            } else {
                if (!user) {
                    res.send("Can't find user.");
                } else {
                    user.userName = crypto.decrypt(user.userName, secretKeys.userNameKey);
                    user.email = crypto.decrypt(user.email, secretKeys.emailKey);
                    user.password = crypto.decrypt(user.password, secretKeys.passwordKey);
                    res.send(user);
                }
            }
        })
    }
};

/**********************************/