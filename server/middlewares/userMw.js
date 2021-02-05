const Ajv = require('ajv').default;
const { ajvErrors } = require('./ajvHelper');

const ajv = new Ajv({ allErrors: true });
require('ajv-formats')(ajv, [ 'email', 'date' ]);
require('ajv-keywords')(ajv, [ 'transform' ]);

const USER_NAME_REGEX = /^.{8,64}$/;

const USER_S_SCHEMA = 'us';
const USER_V_SCHEMA = 'uv';

const USER_PROFILE_S_SCHEMA = 'ups';
const USER_PROFILE_V_SCHEMA = 'upv';

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

ajv.addSchema({
    type: 'object',
    properties: {
        fname: {
            transform: ['trim']
        },
        lname: {
            transform: ['trim']
        },
        bio: {
            transform: ['trim']
        }
    }
}, USER_PROFILE_S_SCHEMA);
  
ajv.addSchema({
    type: 'object',
    properties: {
        fname: {
            type: 'string',
            maxLength: 50
        },
        lname: {
            type: 'string',
            maxLength: 50
        },
        bio: {
            type: 'string',
            maxLength: 200
        },
        birthday: {
            type: ['string', 'null'],
            format: 'date',
        },
        gender: {
            type: ['string', 'null'],
            pattern: '^[mfop]$'
        }
    },
    required: [
        'fname',
        'lname',
        'bio',
        'birthday',
        'gender'
    ]
}, USER_PROFILE_V_SCHEMA);

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
    },

    /**
     * Validates the body of a user profile and check if it meets
     * the requirements specified
     */
    validateUserProfile: (req, res, next) => {
        const profile = req.body;

        ajv.validate(USER_PROFILE_S_SCHEMA, profile);

        const validate = ajv.validate(USER_PROFILE_V_SCHEMA, profile);

        if (!validate) {
            const errors = ajvErrors(ajv);
            console.log(errors);
            return res.status(401).send({ errors });
        }

        next();
    }
};

module.exports = userMw;