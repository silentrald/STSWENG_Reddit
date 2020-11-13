const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const customJWT = {
    /**
     * Signs the token and returns a promise
     * 
     * @param {data}
     * @param {options}
     * @returns {Promise<string>}
     */
    signPromise: (data, options) => {
        return new Promise((resolve, reject) => {
            jwt.sign(data, secret, options, (err, result) => {
                if (err)    reject(err);
                else        resolve(result);
            });
        });
    },

    /**
     * Verifies the token and returns a promise
     * 
     * @param {token}
     * @returns {Promise<boolean>}
     */
    verifyPromise: token => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, result) => {
                if (err)    reject(err);
                else        resolve(result);
            });
        });
    },
};

module.exports = {
    ...customJWT,
    ...jwt
};