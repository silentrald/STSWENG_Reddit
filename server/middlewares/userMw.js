const Ajv = require('ajv');
const { ajvErrors } = require('./ajvHelper');

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
require('ajv-keywords')(ajv, [ 'transform' ]);

const USER_S_SCHEMA = 'us';
const USER_V_SCHEMA = 'uv';

ajv.addSchema({
    type: 'object',
    properties: {
        username: {
            transform: [ 'trim' ]
        },
        email: {
            transform: [ 'trim' ]
        }
    }
}, USER_S_SCHEMA);

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
            maxLength: 256,
            pattern: '^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$'
        },
        email: {
            type: 'string',
            maxLength: 256,
            format: 'email'
        }
    },
    required: [
        'username',
        'password',
        'email'
    ]
}, USER_V_SCHEMA);

const userMw = {
    validateRegisterUser: (req, res, next) => {
        ajv.validate(USER_S_SCHEMA, req.body); // sanitize
        const validate = ajv.validate(USER_V_SCHEMA, req.body);

        if (!validate) {
            const errors = ajvErrors(ajv);
            return res.status(401).send({ errors });
        }

        next();
    }
};

module.exports = userMw;