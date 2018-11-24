var User = require('../models/users');
var crypto = require('../libs/hashing');
var secretKeys = require('../config/secret.keys.js');

async function findUser(query, res) {
    let user = await User.findOne(query)
        .catch((err) => {
            res.send("Server Error");
        });
    return user;
}

function createUser(user, req, res) {
    user.save(user, function(err, user) {
        if (err) {
            res.status(500).send({ "error_msg": 'Internal Error' });
            console.log("Can't insert into database")
        } else {
            req.flash('success_msg', 'You are registered and can now login');
            res.redirect('/signin');
        }
    });
}

module.exports = {
    signupPage: function(req, res, next) {
        res.status(200).send({ "title": "Create New Account" });
    },

    userInfo: async function(req, res, next) {
        if (Object.keys(req.body).length !== 5) {
            res.send("Invalid format");
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
                res.send(errors);
            } else {
                userName = crypto.encrypt(userName.toLowerCase(), secretKeys.userNameKey, secretKeys.userNameIV);
                email = crypto.encrypt(email.toLowerCase(), secretKeys.emailKey, secretKeys.emailIV);
                password = crypto.encrypt(password, secretKeys.passwordKey);

                let user = await findUser({ userName: userName }, res);
                let ep = {};
                if (user) {
                    ep.userName = "Username is exist";
                }
                users = await findUser({ email: email }, res);
                if (user) {
                    ep.email = "Email is exist";
                }

                if (ep) {
                    res.send(ep);
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
    },

    userCheck: (req, res, next) => {
        if (Object.keys(req.body).length !== 1) {
            res.send("Invalid Format")
        } else {
            var email = req.body.email;
            var userName = req.body.userName;

            if (!userName && !email) {
                res.send({ "error_msg": "Enter valid info" });
            } else {
                if (userName) {
                    userName = crypto.encrypt(userName.toLowerCase(), secretKeys.userNameKey, secretKeys.userNameIV);
                    if (findUser({ userName: userName })) {
                        res.send("Username is already used.");
                    }
                } else {
                    email = crypto.encrypt(email.toLowerCase(), secretKeys.emailKey, secretKeys.emailIV);
                    if (findUser({ email: email })) {
                        res.send("Email is already used.");
                    }
                }
            }
        }
    }
}

/**********************************/