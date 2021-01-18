const db = require('../db');

const commentAPI = {
    // GET
    // SUBPOST
    /**
     * Gets the comments of a post
     */
    getSubposts: async (req, res) => {
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

    // SUBCOMMENT
    /**
     * Gets the comments of a comment
     */
    getSubcomments: async (req, res) => {
        const { comment } = req.params;
        const { offset, limit } = req.query;

        try {
            const querySelComment = {
                text: `
                    SELECT      *
                    FROM        comments
                    WHERE       comment_id IN (
                        SELECT  comment_id
                        FROM    subcomments
                        WHERE   parent_comment=$1
                    )
                    ORDER BY    timestamp_created DESC
                    OFFSET      ${offset}
                    LIMIT       ${limit};
                `,
                values: [ comment ]
            };

            const { rows: subcomments } = await db.query(querySelComment);

            return res.status(200).send({ subcomments });
        } catch (err) {
            console.log(err);

            return res.status(500).end();
        }
    },

    // POST
    // SUBPOST
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
    },

    // SUBCOMMENT
    /**
     * Create a subcomment on a specific station,
     * given that the user is a crewmate of the 
     * station and the comment is within the station.
     */
    postSubcomment: async (req, res) => {
        const {
            post: parentPost,
            text,
            station
        } = req.body;

        const { comment: parentComment } = req.params;

        const author = req.user.username;
        let subcomment;

        try {
            // Check if the parent comment is in the station
            const queryComment = {
                text: `
                    SELECT  *
                    FROM    comments
                    WHERE   comment_id=$1
                    LIMIT   1;
                `,
                values: [ parentComment ]
            };
            
            const resultComment = await db.query(queryComment);

            if (resultComment.rowCount < 1) {
                console.log(`Parent Comment(${parentComment}) does not exist`);
                return res.status(403).send({ error: 'PRT_CMT_NONE' });
            }

            if (resultComment.rows[0].station_name !== station) {
                console.log(`Parent Comment(${parentComment}) is not inside the station(${station})`);
                return res.status(403).send({ error: 'INV_PRT_CMT' });
            } 

            const client = await db.connect();
            
            try {
                await client.query('BEGIN');

                const queryInsComment = {
                    text: `
                        INSERT INTO comments(comment_id, text, author, station_name)
                            VALUES(comment_id(), $1, $2, $3)
                        RETURNING *;
                    `,
                    values: [
                        text,
                        author,
                        station
                    ]
                };
    
                const resultComment = await client.query(queryInsComment);
                
                subcomment = resultComment.rows[0];

                const queryInsSubcomment = {
                    text: `
                        INSERT INTO subcomments(parent_post, parent_comment, comment_id)
                            VALUES($1, $2, $3);
                    `,
                    values: [
                        parentPost,
                        parentComment,
                        subcomment.comment_id
                    ]
                };

                await client.query(queryInsSubcomment);

                await client.query('COMMIT');
            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            } finally {
                await client.release();
            }

            return res.status(201).send({ subcomment });
        } catch (err) {
            console.log(err);

            if (err.code === '23503') {
                if (err.constraint === 'pk_subcomments') { // there is already column
                    return res.status(403).send({ error: 'EXISTS' });
                }
            }

            return res.status(500).send();
        }
    },

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