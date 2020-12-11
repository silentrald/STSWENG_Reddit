const Ajv = require('ajv');
const { ajvErrors } = require('./ajvHelper');

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
require('ajv-keywords')(ajv, [ 'transform' ]);

const LIMIT = 10;
const STATION_NAME_REGEX = /^[A-Za-z0-9_-]+$/;
const SORT_REGEX = /^(ASC|DESC)$/;
const TOP_REGEX = /^(hour|day|week|month|year|all)$/;

const POST_S_SCHEMA = 'ps';
const POST_V_SCHEMA = 'pv';

ajv.addSchema({
    type: 'object',
    properties: {
        title: {
            transform: ['trim']
        },
        text: {
            transform: ['trim']
        },
        station_name: {
            transform: ['trim']
        },
        author: {
            transform: ['trim']
        }
    }
}, POST_S_SCHEMA);

ajv.addSchema({
    type: 'object',
    properties: {
        title: {
            type: 'string',
            minLength: 1,
            maxLength: 64
        },
        text: {
            type: 'string',
            minLength: 1,
            maxLength: 1000
        },
        station_name: {
            type: 'string'
        },
        author: {
            type: 'string'
        }
    },
    required: [
        'title',
        'text',
        'station_name',
        'author'
    ]
}, POST_V_SCHEMA);

const postMw = {
    /**
     * Validates the station parameter.
     */
    validateStationParam: (req, res, next) => {
        const { station } = req.params;

        if (!STATION_NAME_REGEX.test(station)) {
            return res.status(403).send({ 
                errors: {
                    station: 'pattern'
                }
            });
        }

        next();
    },

    /**
     * Sanitizes the posts query object.
     * Properties: offset, limit, sort
     */
    sanitizePostsQuery: (req, _res, next) => {
        const {
            offset,
            limit,
            sort,
            top
        } = req.query;

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

        if (!sort || !SORT_REGEX.test(sort)) {
            req.query.sort = 'DESC';
        }

        if (top) {
            if (!TOP_REGEX.test(top)) {
                req.query.top = undefined;
            }
        }

        next();
    },

    /**
     * Validates the object for adding a post.
     * Properties: title, text, author, station_name
     */
    validateSationPost: (req, res, next) => {
        // sanititze
        ajv.validate(POST_S_SCHEMA, req.body);

        // validate
        const validate = ajv.validate(POST_V_SCHEMA, req.body);

        if (!validate) {
            const errors = ajvErrors(ajv);
            return res.status(401).send({ errors });
        }

        next();
    }
};

module.exports = postMw;