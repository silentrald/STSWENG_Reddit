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

    // POST
    /**
     * Adds a post from a user to a given station
     */
    postStationPost: async (req, res) => {
        // Get values
        const {
            title,
            text,
            station_name,
            author
        } = req.body;

        try {

            // Insert post into posts table
            const queryInsPost = {
                text: `
                    INSERT INTO posts(post_id, title, text, author, station_name) 
                        VALUES(post_id(), $1, $2, $3, $4)
                `,
                values: [
                    title,
                    text,
                    author,
                    station_name
                ]
            };

            await db.query(queryInsPost);

            return res.status(201).send();
        } catch (err) {
            console.log(err);
            
            // TODO: detect errors


            return res.status(500).send();
        }
    }

    // PUT

    // DELETE
};

module.exports = postAPI;