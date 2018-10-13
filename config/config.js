const env = process.env.NODE_ENV;
var config = null;
if (env == 'development') {
    config = require('./config.development.json');
} else if (env == 'production') {
    config = require('./config.production.json');
} else if (env == 'test') {
    config = require('./config.test.json');
} else {
    config = require('./config.default.json');
}

module.exports = config;