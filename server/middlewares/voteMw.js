

const voteMw = {
    /**
     * Validates the upvote body
     */
    // TODO: Check the tests here
    validateUpvoteBody: (req, res, next) => {
        const { upvote } = req.body;

        if (typeof(upvote) !== 'boolean') {
            console.log('Invalid upvote');
            return res.status(403).send({
                errors: {
                    upvote: 'type'
                }
            });
        }

        next();
    }
};

module.exports = voteMw;