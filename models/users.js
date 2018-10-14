var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('user', userSchema);