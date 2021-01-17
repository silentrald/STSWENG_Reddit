const db = require('../db');

const commentAPI = {
    // GET

    // POST

    // PATCH
    /**
     * Edits a post by the author
     */
    // TODO: unit and int test
    patchComment: async (req, res) => {
        const { text } = req.body;
        const { comment } = req.params;

        try {
            const queryPtcComment = {
                text: `
                    UPDATE  comments
                    SET     text=$1
                    WHERE   comment_id=$2
                        AND author=$3;
                `,
                values: [
                    text,
                    comment,
                    req.user.username
                ]
            };

            const { rowCount } = await db.query(queryPtcComment);
            if (rowCount < 1) {
                return res.status(404).send();
            }

            return res.status(200).send();
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    }

    // DELETE
};

module.exports = commentAPI;