var crypto = require('crypto-js');

var dataEncryption = {};

dataEncryption.encrypt = function(text, key) {
    var cipherText = crypto.AES.encrypt(text, key);
    return cipherText.toString();
}

dataEncryption.decrypt = function(cipherText, key) {
    var bytes = crypto.AES.decrypt(cipherText.toString(), key);
    var text = bytes.toString(crypto.enc.Utf8);
    return text;
}

module.exports = dataEncryption;
/********************************************/