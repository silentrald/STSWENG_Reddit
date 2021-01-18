const LIMIT = 10;

const queryStringMw = {
    /**
     * Sanitizes the search query string
     */
    sanitizeSearch: (req, _res, next) => {
        const { search } = req.query;

        if (typeof(search) !== 'string') {
            req.query.search = undefined;
        } else {
            req.query.search = `%${search}%`;
        }

        next();
    },

    /**
     * Sanitizes the offset and limit query string
     */
    sanitizeOffsetAndLimit: (req, _res, next) => {
        const {
            offset,
            limit
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

        next();
    }
};

module.exports = queryStringMw;