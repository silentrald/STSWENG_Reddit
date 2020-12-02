
const POST_REGEX = /^p[A-Za-z0-9]{0,11}$/;

const postVoteMw = {
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
    }
};

module.exports = postVoteMw;