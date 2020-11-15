const Ajv = require('ajv');
const jwt = require('../modules/jwt');

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
require('ajv-keywords')(ajv, [ 'transform' ]);

const LOGIN_S_SCHEMA = 'ls';
const LOGIN_V_SCHEMA = 'lv';

ajv.addSchema({
    type: 'object',
    properties: {
        username: {
            transform: [ 'trim' ]
        }
    }
}, LOGIN_S_SCHEMA);

ajv.addSchema({
    type: 'object',
    properties: {
        username: {
            type: 'string',
            minLength: 8,
            maxLength: 64
        },
        password: {
            type: 'string',
            minLength: 8,
            maxLength: 256
        }
    },
    required: [
        'username',
        'password'
    ]
}, LOGIN_V_SCHEMA);

const loginMw = {
    /**
     * 
     * 
     */
    smartLogin: async (req, _res, next) => {
        // Get the token from the Authorization header
        const { authorization } = req.headers;
        if (authorization) {
            const token = authorization.split(' ')[1];
            
            const user = await jwt.verifyPromise(token);
    
            if (user) {
                req.user = user;
            }           
        }

        next();
    },

    isLogin: (req, res, next) => {
        if (!req.user) {
            return res.status(302).send({ route: '/' });
        }

        next();
    },

    isNotLogin: (req, res, next) => {
        if (req.user) {
            return res.status(302).send({ route: '/' });
        }

        next();
    },

    validateLogin: (req, res, next) => {
        ajv.validate(LOGIN_S_SCHEMA, req.body);
        const validate = ajv.validate(LOGIN_V_SCHEMA, req.body);

        if (!validate) {
            return res.status(401).send();
        }

        next();
    }
};

module.exports = loginMw;