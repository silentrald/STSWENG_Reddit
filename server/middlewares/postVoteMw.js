
const POST_REGEX = /^p[A-Za-z0-9]{0,11}$/;

const postVoteMw = {
    /**
     * Validates the post parameter.
     */
    validatePostParam: (req, res, next) => {
        const { post } = req.params;

        if (!POST_REGEX.test(post)) {
            return res.status(403).send({
                errors: {
                    post: 'pattern'
                }
            });
        }

        next();
    },

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

module.exports = postVoteMw;