var express = require("express");
var router = express.Router();

var User = require('../models/users');
var crypto = require('../libs/hashing');
var emailKey = "^5F&hs";
var userNameKey = "Uf%f2";
var passwordKey = "&hs#D6";

// Register User
router.post('/register', function(req, res, next) {
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
        res.send(errors);
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
                    res.send("User or Email is Already exits");
                } else {
                    var newUser = new User({
                        name: name,
                        email: email,
                        userName: userName,
                        password: password
                    });
                    newUser.save(newUser, function(err, user) {
                        if (err) {
                            res.send('Internal Error');
                            console.log("Can't insert into database")
                        } else {
                            res.send('You are registered and can now login');
                        }
                    });
                }

            });
    }
});

module.exports = router;