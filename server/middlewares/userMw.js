const Ajv = require('ajv');
const { ajvErrors } = require('./ajvHelper');

const ajv = new Ajv({ allErrors: true, jsonPointers: true });

const USER_SCHEMA = 'a';

ajv.addSchema({
    type: 'object',
    properties: {
        username: {
            type: 'string',
            minLength: 8,
            maxLength: 50
        },
        password: {
            type: 'string',
            minLength: 10,
            maxLength: 256,
            pattern: '^(?=.{10,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$'
        },
        email: {
            type: 'string',
            maxLength: 128,
            format: 'email'
        },
        fname: {
            type: 'string',
            minLength: 1,
            maxLength: 50
        },
        lname: {
            type: 'string',
            minLength: 1,
            maxLength: 50
        },
        gender: {
            type: 'string',
            pattern: '^(m|f)$'
        },
        birthday: {
            type: 'string',
            format: 'date'
        },
        bio: {
            type: 'string',
            minLength: 1,
            maxLength: 200
        }
    },
    required: [
        'username',
        'password',
        'email',
        'fname',
        'lname',
        'gender',
        'birthday',
        'bio'
    ]
}, USER_SCHEMA);

const userMw = {
    validateRegisterUser: (req, res, next) => {
        const validate = ajv.validate(USER_SCHEMA, req.body);

        if (!validate) {
            const errors = ajvErrors(ajv);
            return res.status(401).send({ errors });
        }

        next();
    }
};

module.exports = userMw;