var app = require('express')();

var db = {
    onConnect: function (err) {
        if (err) {
            console.log("Can't connect database");
        } else {
            console.log("Database connected");
        }
    },

    onDisconnect: function (err) {
        if (err) {
            console.log("Can't disconnect database");
        } else {
            console.log("Database disconnected");
        }
    }
}

// catch 404 error handler
app.use(function (req, res, next) {
    res.status(404).send({
        "error": ["Page Not Found"]
    });
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.send({
        error: ['Server  Error']
    });
    console.log(err);
});

module.exports = {
    app,
    db
}

/************************************/
