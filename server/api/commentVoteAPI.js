const db = require('../db');

const commentVoteAPI = {
    // GET
    /**
     * Gets the comment vote of the user
     */
    getCommentVote: async (req, res) => {
        const { comment } = req.params;

        try {
            const querySelCommentVote = {
                text: `
                    SELECT  upvote
                    FROM    comment_votes
                    WHERE   comment_id=$1
                        AND username=$2
                    LIMIT   1;
                `,
                values: [
                    comment,
                    req.user.username
                ]
            };

            const { rows: commentVote, rowCount } = await db.query(querySelCommentVote);
            if (rowCount < 1) {
                return res.status(200).send({});
            }

            const { upvote } = commentVote[0];

            return res.status(200).send({ upvote });
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    // POST
    /**
     * Creates a new comment vote
     */
    postCommentVote: async (req, res) => {
        const { comment } = req.params;
        const { upvote } = req.body;

        let inc, vote;

        try {
            const client = await db.connect();

            try {
                await client.query('BEGIN');
                const queryInsCommentVote = {
                    text: `
                        INSERT INTO comment_votes(comment_id, username, upvote)
                            VALUES ($1, $2, $3);
                    `,
                    values: [
                        comment,
                        req.user.username,
                        upvote
                    ]
                };

                await client.query(queryInsCommentVote);

                const queryUpComment = {
                    text: `
                        UPDATE  comments
                        SET     score = score ${upvote ? '+' : '-'} 1
                        WHERE   comment_id=$1;
                    `,
                    values: [ comment ]
                };

                await client.query(queryUpComment);

                await client.query('COMMIT');
                vote = upvote ? 1 : -1;
                inc = upvote ? 1 : -1;
            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            } finally {
                client.release();
            }

            return res.status(201).send({ vote, inc });
        } catch (err) {

            // check if the comment vote already exist
            if (err.code === '23505' && err.constraint === 'pk_comment_votes') {
                const querySelCommentVote = {
                    text: `
                        SELECT  upvote
                        FROM    comment_votes
                        WHERE   comment_id=$1
                            AND username=$2
                        LIMIT   1;
                    `,
                    values: [
                        comment,
                        req.user.username
                    ]
                };

                const resultCommentVote = await db.query(querySelCommentVote);
                const commentVote = resultCommentVote.rows[0];

                const deleteVote = commentVote.upvote === upvote;

                // if the upvote is the same, delete the comment vote
                const client = await db.connect();

                try {
                    if (deleteVote) {
                        const queryDelCommentVote = {
                            text: `
                                    DELETE FROM comment_votes
                                    WHERE   comment_id=$1
                                        AND username=$2;
                                `,
                            values: [
                                comment,
                                req.user.username
                            ]
                        };

                        await client.query(queryDelCommentVote);

                        const queryUpComment = {
                            text: `
                                    UPDATE  comments
                                    SET     score = score ${upvote ? '-' : '+'} 1
                                    WHERE   comment_id=$1;
                                `,
                            values: [ comment ]
                        };

                        await client.query(queryUpComment);

                        vote = 0;
                        inc = upvote ? -1 : 1;
                    } else { // if the upvote is different, then change the vote of the user
                        const queryUpCommentVote = {
                            text: `
                                    UPDATE  comment_votes
                                    SET     upvote=$1
                                    WHERE   comment_id=$2
                                        AND username=$3
                                `,
                            values: [
                                upvote,
                                comment,
                                req.user.username
                            ]
                        };

                        await client.query(queryUpCommentVote);

                        const queryUpComment = {
                            text: `
                                    UPDATE  comments
                                    SET     score = score ${upvote ? '+' : '-'} 2
                                    WHERE   comment_id=$1
                                `,
                            values: [ comment ]
                        };
                        
                        await client.query(queryUpComment);

                        vote = upvote ? 1 : -1;
                        inc = upvote ? 2 : -2;
                    }
                        
                    await client.query('COMMIT');
                } catch (err) {
                    await client.query('ROLLBACK');
                    console.log(err);
                    return res.status(500).send();
                } finally {
                    client.release();
                }

                return res.status(200).send({ vote, inc });
            }

            console.log(err);

            return res.status(500).send();
        }
    },
};

module.exports = commentVoteAPI;