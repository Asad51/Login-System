var passport = require('../config/passport.config.js');

module.exports = {
	signinPage: (req, res, next) => {
		res.status(200).send({ "title": "Login to system." });
	},

    ensureAuthenticated: passport.ensureAuthenticated,

	authenticate: passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true}),

	userInfo: (req,  res, next) => {
		//res.redirect('/dashboard');
		res.send("Succcess");
	},

	signout: (req, res, next) => {
		req.logout();
    	req.flash('success_msg', 'You are logged out');
    	res.redirect('/signin');
	}
}

/********************************/