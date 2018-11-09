var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var debug = require('debug')('mean-app:server');
var cors = require('cors');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var passport = require("passport");
var flash = require('connect-flash');
var morgan = require('morgan');
var app = require('express')();

var secretKeys = require('./secret.keys.js');
/*** Using Express Middleware *****/
/**********************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(secretKeys.session));
app.use(expressSession({
    secret: secretKeys.session,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(flash());
app.use(morgan('dev'));

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

module.exports = appConfig;