var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var http = require('http');
var debug = require('debug')('mean-app:server');
var cors = require('cors');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var app = express();
mongoose.Promise = require("bluebird");
var passport = require("passport");
var localStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var morgan = require('morgan');

/***********User Modules *************/
/*************************************/
var config = require('./config/config.js');
var dbUrl = config.db.db_url;
var port = process.env.PORT || config.app.port;

var secretKeys = require('./config/secret.keys.js');

var users = require("./routes/users.js");
var index = require('./routes/index');

/*** Using Express Middleware *****/
/**********************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(secretKeys.session));
app.use(expressSession({
    secret: secretKeys.session,
    saveUninitialized: true,
    resave: true
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

/******** Http Request Handling **********/
/*****************************************/
app.use("/", users);
app.use('/', index);

// catch 404 error handler
app.use(function(req, res, next) {
    res.status(404).send({ "error_msg": "Page Not Found" });
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('Server  Error');
    console.log(err);
});

/***************************************/
/****** Server Connection Handling *****/
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.on('close', onClose);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log("Server running at port " + bind)
    mongoose.connect(dbUrl, connectionError);
}

function onClose(error) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server Closed");
    }
    mongoose.disconnect(disconnectError);
}

/********** Database Connection Error Handling ***/
/*************************************************/
function connectionError(err) {
    if (err) {
        console.log("Can't connect database");
    } else {
        console.log("Database connected");
    }
}

function disconnectError(err) {
    if (err) {
        console.log("Can't disconnect database");
    } else {
        console.log("Database disconnected");
    }
}
/*******************************************************/
