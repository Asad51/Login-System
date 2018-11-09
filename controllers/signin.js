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
            	console.log("Incorrect username.")
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
    done(null, {
        userName: user.userName
    });
});

passport.deserializeUser(function(userName, done) {
    User.findOne({userName: userName})
    	.exec()
    	.then( user => {
    		done(null, user['userName']);
    	})
    	.catch( err => {
    		done(err, null);
    	});

    	/*{
    	if(!user){
    		done(err, null);
    	}
    	else{
	        done(null, user['userName']);
	    }
    });*/
});

module.exports = {
	signinPage: (req, res, next) => {
		console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
		res.status(200).send({ "title": "Login to system." });
	},

	userInfo: (req,  res, next) => {
		passport.authenticate('local', (err, user, info) => {
		    console.log(user);
		    req.login(user, (err) => {
		      	console.log(`req.session.passport: ${JSON.stringify(req.session.passport.user['userName'])}`);
		      	return res.send('You were authenticated & logged in!\n');
		    })
		})(req, res, next);
	},

	signout: (req, res, next) => {
		req.logout();
    	req.flash('success_msg', 'You are logged out');
    	res.redirect('/signin');
	}
}

/********************************/