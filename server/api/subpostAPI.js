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
    },

    // POST
    postSubpost: async(req, res) => {
        const { post } = req.params;
        const { text } = req.body;

        const client = await db.connect();

        try {
            const queryGetPostInfo = {
                text: `
                    SELECT      station_name
                    FROM        posts
                    WHERE       post_id = $1
                    LIMIT       1;
                `,
                values: [ post ]
            };

            const { rows: station, rowCount: postExists } = await db.query(queryGetPostInfo);
            if (!postExists) {
                return res.status(403).send({
                    errors: {
                        post: 'required'
                    }
                });
            }

            await client.query('BEGIN');

            const { station_name } = station[0];
            const queryPostComment = {
                text: `
                    INSERT INTO comments
                    (comment_id, text, author, station_name)
                    VALUES (comment_id(), $1, $2, $3)
                    RETURNING *;
                `,
                values: [ text, req.user.username, station_name ]
            };

            const { rows: comments, rowCount: commentCreated } = await client.query(queryPostComment);
            if (!commentCreated) {
                // TODO: helpful error message
                throw Error('Comment not created.');
            }
            const comment = comments[0];

            const queryPostSubpost = {
                text: `
                    INSERT INTO subposts
                    (comment_id, parent_post)
                    VALUES ($1, $2)
                    RETURNING *;
                `,
                values: [ comment.comment_id, post ]
            };
            const { rowCount: subpostCreated } = await client.query(queryPostSubpost);
            if (!subpostCreated) {
                throw Error('Subpost not created.');
            }

            return res.status(201).send({ comment });
        } catch (err) {
            try {
                await client.query('ROLLBACK');
            } catch (rollbackErr) {
                console.log(rollbackErr);
            }

            return res.status(500).send();
        } finally {
            client.release();
        }
    }

    // PATCH

    // DELETE
};

module.exports = subpostAPI;