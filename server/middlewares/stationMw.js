const Ajv = require('ajv');
const { ajvErrors } = require('./ajvHelper');

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
require('ajv-keywords')(ajv, [ 'transform' ]);

const STATION_S_SCHEMA = 'ss';
const STATION_V_SCHEMA = 'sv';

ajv.addSchema({
    type: 'object',
    properties: {
        name: {
            transform: ['trim']
        },
        description: {
            transform: ['trim']
        },
        rules: {
            transform: ['trim']
        }
    }
}, STATION_S_SCHEMA);

ajv.addSchema({
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 3,
            maxLength: 64,
            pattern: '^[A-Za-z0-9_-]+$'
        },
        description: {
            type: 'string',
            minLength: 0,
            maxLength: 250
        },
        rules: {
            type: 'string',
            minLength: 0,
            maxLength: 1000
        }
    },
    required: [
        'name'
    ]
}, STATION_V_SCHEMA);

const stationMw = {
    validateCreateStation: (req, res, next) => {
        ajv.validate(STATION_S_SCHEMA, req.body); // sanitize
        const validate = ajv.validate(STATION_V_SCHEMA, req.body);

        if (!validate) {
            const errors = ajvErrors(ajv);
            return res.status(401).send({ errors });
        }

        next();
    }
};

module.exports = stationMw;