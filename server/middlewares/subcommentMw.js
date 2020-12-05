const Ajv = require('ajv');
const { ajvErrors } = require('./ajvHelper');

const ajv = new Ajv({ allErrors: true });

const SUBCOMMENT_V_SCHEMA = 'sv';

// '^[A-Za-z0-9_-]+$'

ajv.addSchema({
    type: 'object',
    properties: {
        parentComment: {
            allOf: [
                { pattern: '^c[a-zA-Z0-9]{0,11}$' },
                { maxLength: 12 },
                { minLength: 1 },
                { type: 'string'}
            ]
        },
        text: {
            allOf: [
                { maxLength: 1000 },
                { minLength: 1 },
                // { transform: [ 'trim' ] },
                { type: 'string' }
            ]
        },
        station: {
            allOf: [
                { pattern: '^[A-Za-z0-9_-]+$' },
                { maxLength: 64 },
                { minLength: 1 },
                { type: 'string'}
            ]
        }
    },
    required: [
        'parentComment',
        'text',
        'station'
    ]
}, SUBCOMMENT_V_SCHEMA);

const subcommentMw = {
    /**
     * Validates the object for subcomment posting.
     * Properties: parentComment, text, station
     */
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

        next();
    }
};

module.exports = subcommentMw;