const bcrypt = require('bcrypt');
const saltRounds = 10;

const bcryptCustom = {
    /**
     * Hashes the plain text password with the constant
     * saltRounds(=10)
     * 
     * @param {plainText} password
     * @returns {Promise<string>}
     */
    hashSalt: plainText => bcrypt.hash(plainText, saltRounds),
};

module.exports = {
    ...bcryptCustom,
    ...bcrypt
};