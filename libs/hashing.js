let crypto = require('crypto');

const IV_LENGTH = 16; // For AES, this is always 16
const KEY_LENGTH = 32; // Must be 256 bytes (32 characters)

var createIV = function() {
    return crypto.randomBytes(IV_LENGTH);
}

var createKey = function(){
	return crypto.randomBytes(KEY_LENGTH);
}

function encrypt(plainText, key = createKey(), iv = createIV()) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return Buffer.from(iv).toString('hex') + "." + encrypted;
}

function decrypt(cipherText, key) {
	let textParts = cipherText.split('.')
	let iv = Buffer.from(textParts[0], 'hex');
	let encrypted = textParts[1].toString('hex');

    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = {
	encrypt,
	decrypt
};

/**********************************/