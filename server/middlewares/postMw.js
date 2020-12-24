// const Ajv = require('ajv');

const LIMIT = 10;
const STATION_NAME_REGEX = /^[A-Za-z0-9_-]+$/;
const POST_NAME_REGEX = /^p[A-Za-z0-9]{0,11}$/;
const SORT_REGEX = /^(ASC|DESC)$/;
const TOP_REGEX = /^(hour|day|week|month|year|all)$/;

// const ajv = new Ajv({ allErrors: true });

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
     * Validates the post parameter.
     */
    validatePostParam: (req, res, next) => {
        const { post } = req.params;

        if (!POST_NAME_REGEX.test(post)) {
            return res.status(403).send({
                errors: {
                    post: 'pattern'
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
    }
};

module.exports = postMw;