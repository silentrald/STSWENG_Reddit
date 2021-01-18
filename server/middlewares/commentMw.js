const SUBCOMMENT_LIMIT = 3;
const SUBPOST_LIMIT = 7;
const COMMENT_REGEX = /^c[A-Za-z0-9]{0,11}$/;

const commentMw = {
    /**
     * Validates the comment params
     */
    validateCommentParams: (req, res, next) => {
        const { comment } = req.params;

        if (comment.length < 1) {
            return res.status(403).send({
                errors: {
                    comment: 'minLength'
                }
            });
        } else if (comment.length > 12) {
            return res.status(403).send({
                errors: {
                    comment: 'maxLength'
                }
            });
        } else if (!COMMENT_REGEX.test(comment)) {
            return res.status(403).send({
                errors: {
                    comment: 'pattern'
                }
            });
        }

        next();
    },

    // SUBPOSTS

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
            req.query.limit = SUBPOST_LIMIT;
        }

        next();
    },

    validateComment: (req, res, next) => {
        let { text, station } = req.body;

        // station
        if (typeof(station) !== 'string') {
            return res.status(403).send({
                errors: {
                    station: 'type'
                }
            });
        } else if (station.length < 1) {
            return res.status(403).send({
                errors: {
                    station: 'minLength'
                }
            });
        } else if (station.length > 64) {
            return res.status(403).send({
                errors: {
                    station: 'maxLength'
                }
            });
        }

        // text
        if (typeof(text) !== 'string') {
            return res.status(403).send({
                errors: {
                    text: 'type'
                }
            });
        }
        
        text = text.trimLeft();

        if (text.length < 1) {
            return res.status(403).send({
                errors: {
                    text: 'minLength'
                }
            });
        } else if (text.length > 1000) {
            return res.status(403).send({
                errors: {
                    text: 'maxLength'
                }
            });
        }

        req.body.text = text;

        next();
    },

    // SUBCOMMENTS
    /**
     * Sanitizes the subcomments query
     * properties: offset, limit
     */
    sanitizeSubcommentsQuery: (req, res, next) => {
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
            req.query.limit = SUBCOMMENT_LIMIT;
        }

        next();
    },
};

module.exports = commentMw;