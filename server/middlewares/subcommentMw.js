const Ajv = require('ajv');
const { ajvErrors } = require('./ajvHelper');

const ajv = new Ajv({ allErrors: true });

const LIMIT = 3;

const COMMENT_REGEX = /^c[A-Za-z0-9]{0,11}$/;

const SUBCOMMENT_V_SCHEMA = 'sv';

// '^[A-Za-z0-9_-]+$'

ajv.addSchema({
    type: 'object',
    properties: {
        parentPost: {
            allOf: [
                { pattern: '^p[a-zA-Z0-9]{0,11}$' },
                { maxLength: 12 },
                { minLength: 1 },
                { type: 'string'}
            ]
        },
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
     * Validates the comment params
     */
    validateCommentParams: (req, res, next) => {
        const { comment } = req.params;

        if (!COMMENT_REGEX.test(comment)) {
            return res.status(403).send({
                errors: {
                    comment: 'pattern'
                }
            });
        }

        next();
    },

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
    },

    /**
     * Sanitizes the subcomments query
     * properties: offset, limit
     */
    sanitizeSubommentsQuery: (req, res, next) => {
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
    }
};

module.exports = subcommentMw;