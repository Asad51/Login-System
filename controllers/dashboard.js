

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/signin');
    }
}

module.exports = function(req, res, next){
	var userid = req.params.userid;
    console.log(userid);
    var userName = crypto.encrypt(userid.toLowerCase(), secretKeys.userName);
    User.findOne({ userName: userName }, function(err, user) {
        if (err) {
            res.send("Error in finding user.");
        } else {
            if (!user) {
                res.send("Can't find user.");
            } else {
                user.userName = userid;
                user.email = crypto.decrypt(user.email, secretKeys.email);
                user.password = crypto.decrypt(user.password, secretKeys.password);
                res.send(user);
                console.log(user);
            }
        }
    });
}