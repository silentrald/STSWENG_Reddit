const LIMIT = 7;

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
    }
};

module.exports = subpostMw;