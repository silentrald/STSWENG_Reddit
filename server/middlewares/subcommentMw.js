const Ajv = require('ajv');
const { ajvErrors } = require('./ajvHelper');

const SUBCOMMENT_REGEX = /^c[a-zA-Z0-9]{0,11}$/;


const ajv = new Ajv({ allErrors: true });

const SUBCOMMENT_V_SCHEMA = 'sv';

ajv.addSchema({
    type: 'object',
    properties: {
        parentComment: {
            type: 'string',
            minLength: 1,
            maxLength: 12
        },
        text: {
            type: 'string',
            minLength: 1,
            maxLength: 1000
        },
        station: {
            type: 'string',
            minLength: 1,
            maxLength: 64
        }
    },
    required: [
        'parentComment',
        'text',
        'station'
    ]
}, SUBCOMMENT_V_SCHEMA);

const subcommentMw = {
    validateSubcomment: (req, res, next) => {
        // sanitize
        if (typeof(req.body.text) === 'string')
            req.body.text = req.body.text.trimRight();

        // validate
        const validate = ajv.validate(SUBCOMMENT_V_SCHEMA, req.body);

        if (!validate) {
            const errors = ajvErrors(ajv);
            return res.status(403).send({ errors });
        }

        if (!SUBCOMMENT_REGEX.test(req.body.parentComment)) {
            return res.status(403).send({ 
                errors: {
                    parentComment: 'pattern'
                }
            });
        }

        next();
    }
};

module.exports = subcommentMw;