var crypto = require('../libs/hashing.js');

var User = require('../models/users.js');
var secretKeys = require('../config/secret.keys.js');

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.status(401).send({
                'error': ['You are not logged in']
            });
        }
    },

    details: function (req, res, next) {
        var userid = req.user.id;
        User.findById(userid, function (err, user) {
            if (err) {
                res.status(500).send({
                    error: ["Server Error"]
                });
            } else {
                if (!user) {
                    res.status(401).send({
                        error: "You are not logged in."
                    });
                } else {
                    user.userName = crypto.decrypt(user.userName, secretKeys.userNameKey);
                    user.email = crypto.decrypt(user.email, secretKeys.emailKey);
                    res.status(200).send({
                        name: user.name,
                        userName: user.userName,
                        email: user.email
                    });
                }
            }
        })
    }
};

/**********************************/
