const db = require('../db');

const postAPI = {
    // GET

    /**
     * Gets posts from all stations
     */
    getPosts: async (req, res) => {
        const {
            offset,
            limit,
            sort,
            top
        } = req.query;

        try {
            let text;

            if (top) {
                if (top === 'all') {
                    text = `
                        SELECT      *
                        FROM        posts
                        ORDER BY    score DESC, timestamp_created DESC
                        OFFSET      $1
                        LIMIT       $2;
                    `;
                } else {
                    text = `
                        SELECT      *
                        FROM        posts
                        WHERE       timestamp_created <= now()
                            AND     timestamp_created >= now() - interval '1 ${top}'
                        ORDER BY    score DESC, timestamp_created DESC
                        OFFSET      $1
                        LIMIT       $2;
                    `;
                }
            } else {
                text = `
                    SELECT      *
                    FROM        posts
                    ORDER BY    timestamp_created ${sort}
                    OFFSET      $1
                    LIMIT       $2;
                `;
            }

            const queryPosts = {
                text,
                values: [
                    offset,
                    limit
                ]
            };
            const { rows: posts } = await db.query(queryPosts);

            return res.status(200).send({ posts });
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    /**
     * Gets all the posts from a given station
     */
    getStationPosts: async (req, res) => {
        const { station } = req.params;
        const { 
            offset,
            limit,
            sort,
            top
        } = req.query;

        try {
            let text;

            if (top) {
                if (top === 'all') {
                    text = `
                        SELECT      *
                        FROM        posts
                        WHERE       station_name=$1
                        ORDER BY    score DESC, timestamp_created DESC
                        OFFSET      $2
                        LIMIT       $3;
                    `;
                } else {
                    text = `
                        SELECT      *
                        FROM        posts
                        WHERE       station_name=$1
                        AND         timestamp_created <= now()
                        AND         timestamp_created >= now() - interval '1 ${top}'
                        ORDER BY    score DESC, timestamp_created DESC
                        OFFSET      $2
                        LIMIT       $3;
                    `;
                }
            } else {
                text = `
                    SELECT      *
                    FROM        posts
                    WHERE       station_name=$1
                    ORDER BY    timestamp_created ${sort}
                    OFFSET      $2
                    LIMIT       $3;
                `;
            }

            const queryStationPosts = {
                text,
                values: [
                    station,
                    offset,
                    limit
                ]
            };

            const { rows: posts } = await db.query(queryStationPosts);

            return res.status(200).send({ posts });
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    }

    // POST

    // PUT

    // DELETE
};

module.exports = postAPI;