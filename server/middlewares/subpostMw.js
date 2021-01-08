const Ajv = require('ajv');
const { ajvErrors } = require('./ajvHelper');

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
require('ajv-keywords')(ajv, [ 'transform' ]);

const LIMIT = 7;

const COMMENT_S_SCHEMA = 'cs';
const COMMENT_V_SCHEMA = 'cv';

ajv.addSchema({
    type: 'object',
    properties: {
        text: {
            transform: ['trim']
        }
    }
}, COMMENT_S_SCHEMA);

ajv.addSchema({
    type: 'object',
    properties: {
        text: {
            allOf: [
                { maxLength: 1000 },
                { minLength: 1 },
                { type: 'string' }
            ]
        }
    },
    required: [
        'text'
    ]
}, COMMENT_V_SCHEMA);

const subpostMw = {
    /**
     * Sanitizes the subposts query
     * properties: offset, limit
     */
    sanitizeSubpostsQuery: (req, res, next) => {
        const { offset, limit } = req.query;

        if (!offset ||
            !Number.isInteger(parseInt(offset)) ||
            offset < 0
        ) {
            req.query.offset = 0;
        }

        if (!limit ||
            !Number.isInteger(parseInt(limit)) ||
            limit < 1
        ) {
            req.query.limit = LIMIT;
        }

        next();
    },

    validateComment: (req, res, next) => {
        ajv.validate(COMMENT_S_SCHEMA, req.body); // sanitize
        const validate = ajv.validate(COMMENT_V_SCHEMA, req.body);

        if (!validate) {
            const errors = ajvErrors(ajv);
            return res.status(403).send({ errors });
        }

        next();
    }
};

module.exports = subpostMw;