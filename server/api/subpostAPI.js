const db = require('../db');

const subpostAPI = {
    // GET
    /**
     * Gets the comments of a post
     */
    getPostSubposts: async (req, res) => {
        const { post } = req.params;
        const { offset, limit } = req.query;

        try {
            const querySelSubposts = {
                text: `
                    SELECT      *
                    FROM        comments
                    WHERE       comment_id IN (
                        SELECT  comment_id
                        FROM    subposts
                        WHERE   parent_post=$1
                    )
                    ORDER BY    timestamp_created DESC
                    OFFSET      ${offset}
                    LIMIT       ${limit};
                `,
                values: [ post ]
            };

            const { rows: subposts } = await db.query(querySelSubposts);

            return res.status(200).send({ subposts });
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    }

    // POST

    // PATCH

    // DELETE
};

module.exports = subpostAPI;