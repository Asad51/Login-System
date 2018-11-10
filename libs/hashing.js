var crypto = require('crypto');

var dataEncryption = {};

dataEncryption.encrypt = function(text, key) {
	const cipher = crypto.createCipher('aes192', key);
	let encrypted = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');

	return encrypted;
}

dataEncryption.decrypt = function(cipherText, key) {
	const decipher = crypto.createDecipher('aes192', key);
	let decrypted = decipher.update(cipherText, 'hex', 'utf8');
	decrypted += decipher.final('utf8');

	return decrypted;
}

module.exports = dataEncryption;

/********************************************/