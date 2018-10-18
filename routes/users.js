var express = require("express");
var router = express.Router();

var User = require('../models/users');
var crypto = require('../libs/hashing');
var emailKey = "^5F&hs";
var userNameKey = "Uf%f2";
var passwordKey = "&hs#D6";

/******* User Registration ****************/
/******************************************/
router.post('/register', function(req, res, next) {
    if (Object.keys(req.body).length !== 5) {
        res.send("Enter valid Info.")
    } else {
        var name = req.body.name;
        var email = req.body.email;
        var userName = req.body.userName;
        var password = req.body.password;
        var rePassword = req.body.rePassword;

        // Validation
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('userName', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('rePassword', 'Passwords do not match').equals(password);

        var errors = req.validationErrors();

        if (errors) {
            console.log(errors);
            res.status(400).send({ "error_msg": "In valid Format" });
        } else {
            userName = crypto.encrypt(userName.toLowerCase(), userNameKey);
            email = crypto.encrypt(email.toLowerCase(), emailKey);
            password = crypto.encrypt(password, passwordKey);
            //checking for email and username are already taken
            User.findOne({
                    $or: [{ userName: userName }, { email: email }]
                },
                function(err, user) {
                    if (user) {
                        res.send({ "error_msg": "User or Email is Already exits" });
                    } else {
                        var newUser = new User({
                            name: name,
                            email: email,
                            userName: userName,
                            password: password
                        });
                        newUser.save(newUser, function(err, user) {
                            if (err) {
                                res.status(500).send({ "error_msg": 'Internal Error' });
                                console.log("Can't insert into database")
                            } else {
                                res.status(201).send({ "success_msg": "Registration Successful." });
                            }
                            console.log(user);
                        });
                    }

                });
        }
    }
});

/****** User Checking *************/
/**********************************/
router.post('/check_user', function(req, res, next) {
    if (Object.keys(req.body).length !== 1) {
        res.send("Invalid Format")
    } else {
        var email = req.body.email;
        var userName = req.body.userName;

        if (!userName && !email) {
            res.send({ "error_msg": "Enter valid info" });
        } else {
            if (userName) {
                userName = crypto.encrypt(userName.toLowerCase(), userNameKey);
                User.findOne({ userName: userName }, function(err, user) {
                    if (user) {
                        res.send("Username is already used.");
                    } else {
                        res.status(200).send({ "success_msg": "" });
                    }
                });
            } else {
                email = crypto.encrypt(email.toLowerCase(), emailKey);
                User.findOne({ email: email }, function(err, user) {
                    if (user) {
                        res.send("Email is already used.");
                    } else {
                        res.status(200).send({ "success_msg": "" });
                    }
                })
            }

        }

    }
});

/************ User Login **********/
/**********************************/
router.post("/login", function(req, res, next) {
    if (Object.keys(req.body).length !== 2) {
        res.send("Invalid Format");
    } else {
        var email = req.body.email;
        var password = req.body.password;

        req.checkBody("email", "Email is empty");
        req.checkBody("password", "Password is empty");

        var errors = req.validationErrors();

        if (errors) {
            res.send(errors);
        } else {
            email = crypto.encrypt(email.toLowerCase(), emailKey);
            password = crypto.encrypt(password, passwordKey);
            User.findOne({ email: email, password: password }, function(err, user) {
                if (user) {
                    res.send("Login successful");
                } else {
                    res.send("Email or password is wrong");
                }
                console.log(req.body);
            });
        }
    }
});

/******* User Info ***************/
/*********************************/
router.get("/user/:userid", function(req, res, next) {
    var userid = req.params.userid;
    console.log(userid);
    var userName = crypto.encrypt(userid.toLowerCase(), userNameKey);
    User.findOne({ userName: userName }, function(err, user) {
        if (err) {
            res.send("Error in finding user.");
        } else {
            if (!user) {
                res.send("Can't find user.");
            } else {
                user.userName = userid;
                user.email = crypto.decrypt(user.email, emailKey);
                user.password = crypto.decrypt(user.password, passwordKey);
                res.send(user);
                console.log(user);
            }
        }
    });
});

module.exports = router;
/**********************************/
