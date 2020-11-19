const Ajv = require('ajv');
const { ajvErrors } = require('./ajvHelper');

const PASSWORD_REGEX = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$/;


const ajv = new Ajv({ allErrors: true, jsonPointers: true });

const USER_V_SCHEMA = 'uv';

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
        if (typeof(req.body.username) === 'string')
            req.body.username = req.body.username.trim();
        
        if (typeof(req.body.email) === 'string')
            req.body.email = req.body.email.trim();

        // validate
        const validate = ajv.validate(USER_V_SCHEMA, req.body);

        if (!validate) {
            const errors = ajvErrors(ajv);
            return res.status(401).send({ errors });
        }

        if (!PASSWORD_REGEX.test(req.body.password)) {
            return res.status(401).send({
                errors: { password: 'pattern' }
            });
        }

        next();
    }
};

module.exports = userMw;