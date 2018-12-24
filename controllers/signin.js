let passport = require('../config/passport.config.js');
let secretKeys = require('../config/secret.keys');
let jwt = require('jsonwebtoken');

module.exports = {
    userInfo: (req, res, next) => {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return res.status(500).send({
                    error: ["Server Error"]
                });
            }
            if (!user) {
                res.status(401).send({
                    error: ["Incorrect Username or Password"]
                });
            } else {
                req.login(user, (err) => {
                    if (err) {
                        return res.status(500).send({
                            error: ["Server Error"]
                        });
                    }
                    let token = jwt.sign({
                        id: user.id,
                        name: user.name
                    }, secretKeys.jwt, {
                        algorithm: 'HS256'
                    });
                    res.status(201).json({
                        success: "Login Successful.",
                        token: token
                    });
                });
            }
        })(req, res, next);
    },

    signout: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send({
                error: ["You are not logged in."]
            });
        }
        req.session.destroy(function () {
            res.clearCookie('x-auth');
            res.status(200).send({
                success: 'You are now logged out'
            });
        });
    }
}

/********************************/
