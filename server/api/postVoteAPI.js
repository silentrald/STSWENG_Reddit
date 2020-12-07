// const db = require('../db');
// const LRU = require('lru-cache');

// // TODO: Update cache value when someone upvotes
// const votePostCache = new LRU(1000);

const postVoteAPI = {
    // GET
    /**
     * Gets the score of a post with the 
     * amount of upvotes minus downvotes.
     * This will also use caching to lessen
     * the load on the database server.
     */
    // getScore: async (req, res) => {
    //     const { post } = req.params;

    //     // Check if there is a cached value
    //     const score = votePostCache.peek(post);
    //     if (score !== undefined) {
    //         console.log(`Cached ${post}: ${score}`);
    //         return res.status(200).send({ score });
    //     }

    //     try {
    //         const querySelPostVotes = {
    //             text: `
    //                 SELECT      upvote,
    //                             COUNT(*) as count
    //                 FROM        post_votes
    //                 WHERE       post_id=$1
    //                 GROUP BY    upvote;
    //             `,
    //             values: [ post ]
    //         };

    //         const { rows } = await db.query(querySelPostVotes);
    //         // if (rowCount < 1) {
    //         //     return res.status(200).send({ score: 0 });
    //         // }
            
    //         const votes = {
    //             true: 0,
    //             false: 0
    //         };

    //         for (const index in rows) {
    //             votes[rows[index].upvote] = rows[index].count;
    //         }

    //         const score = votes.true - votes.false;

    //         votePostCache.set(post, score);
    //         return res.status(200).send({ score });
    //     } catch (err) {
    //         console.log(err);

    //         return res.status(500).send();
    //     }
    // }

    // POST

    // PUT

    // DELETE
};

module.exports = postVoteAPI;