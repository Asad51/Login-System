var User = require('../models/users');
var crypto = require('../libs/hashing');
var secretKeys = require('../config/secret.keys.js');

async function findUser(query, res) {
    let user = await User.findOne(query)
        .catch((err) => {
            res.status(500).send({
                error: ["Server Error"]
            });
            return null;
        });
    return user;
}

function createUser(user, req, res) {
    user.save(user, function (err, user) {
        if (err) {
            res.status(500).send({
                "error": ['Internal Error']
            });
        } else {
            res.status(201).send({
                success: 'You are registered and can now login'
            });
        }
    });
}

module.exports = {
    userInfo: async function (req, res, next) {
        if (Object.keys(req.body).length !== 5) {
            res.status(422).send({
                error: ["Invalid format"]
            });
        } else {
            var name = req.body.name;
            var email = req.body.email;
            var userName = req.body.userName;
            var password = req.body.password;
            var confirmPassword = req.body.confirmPassword;

            // Validation
            req.checkBody('name', 'Name is required').notEmpty();
            req.checkBody('email', 'Email is required').notEmpty();
            req.checkBody('email', 'Email is not valid').isEmail();
            req.checkBody('userName', 'Username is required').notEmpty();
            req.checkBody('password', 'Password is required').notEmpty();
            req.checkBody('confirmPassword', 'Passwords do not match').equals(password);
            var errors = req.validationErrors();

            if (errors) {
                res.status(422).send({
                    error: errors
                });
            } else {
                userName = crypto.encrypt(userName.toLowerCase(), secretKeys.userNameKey, secretKeys.userNameIV);
                email = crypto.encrypt(email.toLowerCase(), secretKeys.emailKey, secretKeys.emailIV);
                password = crypto.encrypt(password, secretKeys.passwordKey);

                let user = await findUser({
                    userName: userName
                }, res);
                let ep = [];
                if (user) {
                    ep.push("Username is exist");
                }
                users = await findUser({
                    email: email
                }, res);
                if (user) {
                    ep.push("Email is exist");
                }

                if (ep.length > 0) {
                    res.status(422).send({
                        error: ep
                    });
                } else {
                    var newUser = new User({
                        name: name,
                        email: email,
                        userName: userName,
                        password: password
                    });
                    createUser(newUser, req, res);
                }
            }
        }
    }
}
