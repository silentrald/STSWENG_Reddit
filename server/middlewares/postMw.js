// const Ajv = require('ajv');

const LIMIT = 10;
const STATION_NAME_REGEX = /^[A-Za-z0-9_-]+$/;

// const ajv = new Ajv({ allErrors: true });

const postMw = {
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

    sanitizePostsQuery: (req, _res, next) => {
        const query = req.query;

        if (!query.offset)  query.offset = 0;
        if (!query.limit)   query.limit = LIMIT;
        if (!query.sort)    query.sort = 'DESC';

        next();
    }
};

module.exports = postMw;