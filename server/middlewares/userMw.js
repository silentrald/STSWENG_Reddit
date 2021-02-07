const Ajv = require('ajv').default;
const { ajvErrors } = require('./ajvHelper');

const ajv = new Ajv({ allErrors: true });
require('ajv-formats')(ajv, [ 'email' ]);
require('ajv-keywords')(ajv, [ 'transform' ]);

const USER_NAME_REGEX = /^.{8,64}$/;

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
            allOf: [
                { pattern: '^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$' },
                { maxLength: 256 },
                { minLength: 8 },
                { type: 'string' }
            ]
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
    /**
     * Validates the object for user registration.
     * Properties: username, password, email
     */
    validateRegisterUser: (req, res, next) => {
        // sanitize
        ajv.validate(USER_S_SCHEMA, req.body);

        // validate
        const validate = ajv.validate(USER_V_SCHEMA, req.body);

        if (!validate) {
            const errors = ajvErrors(ajv);
            return res.status(401).send({ errors });
        }

        next();
    },

    /**
     * Validates the param for usernames and checks if it meets the 
     * length requirement
     */
    validateUserParam: (req, res, next) => {
        const { username } = req.params;

        console.log(USER_NAME_REGEX.test(username));

        if (!USER_NAME_REGEX.test(username)) {
            return res.status(400).send({
                errors: {
                    username: 'pattern'
                }
            });
        }

        next();
    }
};

module.exports = userMw;