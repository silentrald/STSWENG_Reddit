const db = require('../db');

const Ajv = require('ajv');
const { ajvErrors } = require('./ajvHelper');

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
require('ajv-keywords')(ajv, [ 'transform' ]);

const STATION_S_SCHEMA = 'ss';
const STATION_V_SCHEMA = 'sv';

const STATION_NAME_REGEX = /^[A-Za-z0-9_-]+$/;

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
            allOf: [
                { pattern: '^[A-Za-z0-9_-]+$' },
                { maxLength: 64 },
                { minLength: 3 },
                { type: 'string' }
            ]
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
    isCaptain: async (req, res, next) => {
        const { stationName } = req.params;

        const querySelCaptains = {
            text: `
                SELECT COUNT(*) FROM captains
                WHERE username = $1 AND station_name = $2
                LIMIT 1;
            `,
            values: [ req.user.username, stationName ]
        };

        const { rows } = await db.query(querySelCaptains); 

        if (rows[0] === 0) {
            return res.status(403).send({
                errors: {
                    stationName: 'isNotCaptain'
                }
            });
        }

        next();
    },

    validateStationParam: (req, res, next) => {
        const { stationName } = req.params;

        if (!STATION_NAME_REGEX.test(stationName)) {
            return res.status(403).send({ 
                errors: {
                    stationName: 'pattern'
                }
            });
        }

        next();
    },

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