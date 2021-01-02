// const db = require('../db');
// const LRU = require('lru-cache');

const db = require('../db');

const postVoteAPI = {
    // GET
    /**
     * Gets the post vote of the user
     */
    // TODO: Make unit and int test
    getPostVote: async (req, res) => {
        const { post } = req.params;

        try {
            const querySelPostVote = {
                text: `
                    SELECT  upvote
                    FROM    post_votes
                    WHERE   post_id=$1
                        AND username=$2
                    LIMIT   1;
                `,
                values: [
                    post,
                    req.user.username
                ]
            };

            const { rows: postVote, rowCount } = await db.query(querySelPostVote);
            if (rowCount < 1) {
                return res.status(200).send({});
            }

            const { upvote } = postVote[0];

            return res.status(200).send({ upvote });
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    // POST
    /**
     * Creates a new post vote
     */
    // TODO: Make unit and int test
    postPostVote: async (req, res) => {
        const { post } = req.params;
        const { upvote } = req.body;

        try {
            const client = await db.connect();

            try {
                await client.query('BEGIN');
                const queryInsPostVote = {
                    text: `
                        INSERT INTO post_votes(post_id, username, upvote)
                            VALUES ($1, $2, $3);
                    `,
                    values: [
                        post,
                        req.user.username,
                        upvote
                    ]
                };

                await client.query(queryInsPostVote);

                const queryUpPost = {
                    text: `
                        UPDATE  posts
                        SET     score = score ${upvote ? '+' : '-'} 1
                        WHERE   post_id=$1;
                    `,
                    values: [ post ]
                };

                await client.query(queryUpPost);

                await client.query('COMMIT');
            }
            catch (err) {
                await client.query('ROLLBACK');

                // check if the post vote already exist
                if (err.code === '23505' && err.constraint === 'pk_post_votes') {
                    const querySelPostVote = {
                        text: `
                            SELECT  upvote
                            FROM    post_votes
                            WHERE   post_id=$1
                                AND username=$2
                            LIMIT   1;
                        `,
                        values: [
                            post,
                            req.user.username
                        ]
                    };
    
                    const resultPostVote = await db.query(querySelPostVote);
                    const postVote = resultPostVote.rows[0];
    
                    const deleteVote = postVote.upvote === upvote;
    
                    // if the upvote is the same, delete the post vote
                    const client = await db.connect();

                    let vote, inc;
                    try {
                        if (deleteVote) {
                            const queryDelPostVote = {
                                text: `
                                        DELETE FROM post_votes
                                        WHERE   post_id=$1
                                            AND username=$2;
                                    `,
                                values: [
                                    post,
                                    req.user.username
                                ]
                            };
    
                            await client.query(queryDelPostVote);
    
                            const queryUpPost = {
                                text: `
                                        UPDATE  posts
                                        SET     score = score ${upvote ? '-' : '+'} 1
                                        WHERE   post_id=$1
                                    `,
                                values: [ post ]
                            };
    
                            await client.query(queryUpPost);

                            vote = 0;
                            inc = upvote ? -1 : 1;
                        } else { // if the upvote is different, then change the vote of the user
                            const queryUpPostVote = {
                                text: `
                                        UPDATE  post_votes
                                        SET     upvote=$1
                                        WHERE   post_id=$2
                                            AND username=$3
                                    `,
                                values: [
                                    upvote,
                                    post,
                                    req.user.username
                                ]
                            };
    
                            await db.query(queryUpPostVote);
    
                            const queryUpPost = {
                                text: `
                                        UPDATE  posts
                                        SET     score = score ${upvote ? '+' : '-'} 2
                                        WHERE   post_id=$1
                                    `,
                                values: [ post ]
                            };
                            
                            await db.query(queryUpPost);

                            vote = upvote ? 1 : -1;
                            inc = upvote ? 2 : -2;
                        }
                            
                        await db.query('COMMIT');
                    } catch (err) {
                        await client.query('ROLLBACK');
                        throw err;
                    } finally {
                        client.release();
                    }
                    
                    return res.status(200).send({ vote, inc });
                }

                throw err;
            } finally {
                client.release();
            }

            return res.status(201).send({
                vote: upvote ? 1 : -1,
                inc: upvote ? 1 : -1 }
            );
        } catch (err) {

            console.log(err);

            return res.status(500).send();
        }
    },

    // PUT

    // DELETE
};

module.exports = postVoteAPI;