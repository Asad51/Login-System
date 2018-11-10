var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require("passport");
var flash = require('connect-flash');
var morgan = require('morgan');
var MongoStore = require('connect-mongo')(session);
//var cookieSession = require('cookie-session');

var app = require('express')();
var secretKeys = require('./secret.keys.js');
/*** Using Express Middleware *****/
/**********************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(secretKeys.session));
app.use(session({
    secret: secretKeys.session,
    saveUninitialized: true,
    resave: false,
    cookie: { expires: false },
    store: new MongoStore({ url: 'mongodb://localhost/db_lgsys' })
}));


/*app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [secretKeys.session]
}))*/

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

module.exports = app;

/**************************************/