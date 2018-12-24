var app = require('express')();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require("passport");
var morgan = require('morgan');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var secretKeys = require('./secret.keys.js');
/*** Using Express Middleware *****/
/**********************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors({
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", " X-Requested-With", "Content-Type", "Accept", "Authorization"],
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    credentials: true
}));

app.use(cookieParser(secretKeys.session));
app.use(session({
    name: "x-auth",
    secret: secretKeys.session,
    saveUninitialized: true,
    resave: false,
    cookie: {
        name: "x-auth",
        expires: false
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev'));

// Express Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return msg;
    }
}));

module.exports = app;

/**************************************/
