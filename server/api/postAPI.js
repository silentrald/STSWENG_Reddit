const db = require('../db');

const postAPI = {
    // GET
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
    },

    /**
     * Gets a post from a station
     */
    getStationPost: async (req, res) => {
        const { post, station } = req.params;

        try {
            const querySelStation = {
                text: `
                    SELECT  *
                    FROM    posts
                    WHERE   post_id=$1
                    AND     station_name=$2
                    LIMIT   1;
                `,
                values: [ post, station ]
            };

            const { rows: posts, rowCount } = await db.query(querySelStation);

            if (rowCount < 1) {
                // Post not found
                return res.status(404).send();
            }

            return res.status(200).send({ post: posts[0] });
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