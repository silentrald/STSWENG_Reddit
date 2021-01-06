const db = require('../db');

const queryMw = {
    userIsPartOfStation: async (req, res, next) => {
        let { station } = req.body;
        if (!station) {
            station = req.params.station;
        }

        const querySelPassengers = {
            text: `
                SELECT  *
                FROM    passengers
                WHERE   username = $1
                    AND station_name = $2
                LIMIT 1;
            `,
            values: [
                req.user.username,
                station
            ]
        };

        const { rowCount } = await db.query(querySelPassengers);
        const joined = rowCount > 0;

        if (!joined) {
            return res.status(403).send();
        }

        next();
    },
    
    /**
     * Gets the station name from a post and sets it
     * to the req body
     */
    // TODO: Make unit and int test
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
    }
};

module.exports = queryMw;