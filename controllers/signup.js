var User = require('../models/users');
var crypto = require('../libs/hashing');
var secretKeys = require('../config/secret.keys.js');

module.exports = {
	signupPage: function(req, res, next){
		res.status(200).send({ "title": "Create New Account" });
	},

	userInfo: (req, res, next) => {
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
	                                res.status(500).send({ "error_msg": 'Internal Error' });
	                                console.log("Can't insert into database")
	                            } else {
	                                req.flash('success_msg', 'You are registered and can now login');
	                                res.redirect('/signin');
	                            }
	                        });
	                    }

	                });
	        }
	    }
	},

	userCheck: (req, res, next) =>{
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
	                User.findOne({ userName: userName }, function(err, user) {
	                    if (user) {
	                        res.send("Username is already used.");
	                    } else {
	                        res.status(200).send({ "success_msg": "" });
	                    }
	                });
	            } else {
	                email = crypto.encrypt(email.toLowerCase(), secretKeys.emailKey, secretKeys.emailIV);
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
	}
}

/**********************************/