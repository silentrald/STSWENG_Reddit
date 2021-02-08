const db = require('../db');

const queryMw = {
    /**
     * Responds with 'not_crew' if user is not a member of the station
     */
    userIsPartOfStation: async (req, res, next) => {
        let { station } = req.body;
        if (!station) {
            station = req.params.station;
        }

        try {
            const querySelPassengers = {
                text: `
                    SELECT  *
                    FROM    passengers
                    WHERE   username = $1
                        AND station_name = $2
                    LIMIT   1;
                `,
                values: [
                    req.user.username,
                    station
                ]
            };
    
            const { rowCount } = await db.query(querySelPassengers);
    
            if (rowCount < 1) {
                return res.status(403).send({ error: 'not_crew' });
            }
    
            next();
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    /**
     * Responds with 'not_author' if user is not the author of the post
     */
    userIsAuthor: async (req, res, next) => {
        const { username } = req.user;
        const { post } = req.params;

        try {
            const queryGetAuthor = {
                text: `
                    SELECT  *
                    FROM    posts
                    WHERE   post_id=$1
                        AND author=$2
                    LIMIT 1;
                `,
                values: [ 
                    post, 
                    username 
                ]
            };

            const { rowCount } = await db.query(queryGetAuthor);

            if (rowCount === 0) {
                return res.status(403).send({ error: 'not_author' });
            }
    
            next();
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    /**
     * Gets the station name from a post and sets it
     * to the req body
     */
    getStationPostParams: async (req, res, next) => {
        const { post } = req.params;

        try {
            // Check whether the user is a crewmate
            const querySelPost = {
                text: `
                    SELECT  station_name
                    FROM    posts
                    WHERE   post_id=$1
                    LIMIT   1;
                `,
                values: [ post ]
            };

            const { rows: posts, rowCount: postCount } = await db.query(querySelPost);
            if (postCount === 0) {
                return res.status(404).send();
            }

            req.body.station = posts[0].station_name;
            next();
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    /**
     * Gets the station name from a comment and sets
     * it to the req body
     */
    getStationCommentParams: async (req, res, next) => {
        const { comment } = req.params;

        try {
            const querySelComment = {
                text: `
                    SELECT  station_name
                    FROM    comments
                    WHERE   comment_id=$1
                    LIMIT   1;
                `,
                values: [ comment ]
            };

            const { rows: comments, rowCount } = await db.query(querySelComment);
            if (rowCount === 0) {
                return res.status(404).send();
            }

            req.body.station = comments[0].station_name;
            next();
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    isCaptain: async (req, res, next) => {
        const { stationName } = req.params;

        const querySelCaptains = {
            text: `
                SELECT * FROM captains
                WHERE username = $1 AND station_name = $2
                LIMIT 1;
            `,
            values: [ req.user.username, stationName ]
        };

        const { rows } = await db.query(querySelCaptains); 

        if (rows.length === 0) {
            return res.status(403).send({
                errors: {
                    stationName: 'isNotCaptain'
                }
            });
        }

        next();
    },

    commentNotDeleted: async (req, res, next) => {
        const { comment } = req.params;

        const querySelComment = {
            text: `
                SELECT  *
                FROM    comments
                WHERE   comment_id=$1
                LIMIT   1;
            `,
            values: [ comment ]
        };

        const { rows } = await db.query(querySelComment); 

        // non-existent comment is technically not 'deleted'
        // because it has not been deleted
        if (rows.length === 0) {
            return next();
        }

        const commentObj = rows[0];
        if (commentObj.deleted) {
            return res.status(403).send({
                errors: {
                    comment: 'deleted'
                }
            });
        }

        next();
    }
};

module.exports = queryMw;