var http = require('http');
var debug = require('debug')('mean-app:server');
var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");

/***********User Modules *************/
/*************************************/
var app = require('./config/app.config.js');
var config = require('./config/config.js');
var errorHandler = require('./config/errorHanlder.js');

var dbUrl = config.db.db_url;
var port = process.env.PORT || config.app.port;

var users = require("./routes/users.js");
var index = require('./routes/index');

app.use("/", users);
app.use('/', index);

app.use(errorHandler.app);

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
    mongoose.connect(dbUrl, {
            useNewUrlParser: true
        },
        errorHandler.db.onConnect);
}

function onClose(error) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server Closed");
    }
    mongoose.disconnect(errorHandler.db.onDisconnect);
}

/*******************************************************/
