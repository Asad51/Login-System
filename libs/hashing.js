var crypto = require('crypto-js');

var dataEncryption = {};

dataEncryption.encrypt = function(text, key) {
    var cipherText = crypto.HmacSHA1(text, key);
    return cipherText.toString();
}

dataEncryption.decrypt = function(cipherText, key) {
    var bytes = crypto.HmacSHA1(cipherText.toString(), key);
    var text = bytes.toString(crypto.enc.Utf8);
    return text;
}

module.exports = dataEncryption;
/********************************************/