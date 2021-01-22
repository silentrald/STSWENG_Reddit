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
            top,
            search
        } = req.query;

        try {
            let text, values;

            if (top) {
                if (top === 'all') {
                    text = `
                        SELECT      *
                        FROM        posts
                        ORDER BY    score DESC, timestamp_created DESC
                        OFFSET      $1
                        LIMIT       $2;
                    `;
                    values = [
                        offset,
                        limit
                    ];
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
                values = [
                    offset,
                    limit
                ];
            } else if (search) {
                text = `
                    SELECT      *
                    FROM        posts
                    WHERE       title ILIKE $1
                        OR      text ILIKE $1
                    ORDER BY    score DESC, timestamp_created DESC
                    OFFSET      $2
                    LIMIT       $3;
                `;
                values = [
                    search,
                    offset,
                    limit
                ];
            } else {
                text = `
                    SELECT      *
                    FROM        posts
                    ORDER BY    timestamp_created ${sort}
                    OFFSET      $1
                    LIMIT       $2;
                `;
                values = [
                    offset,
                    limit
                ];
            }

            const queryPosts = { text, values };
            const { rows: posts } = await db.query(queryPosts);

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
        const { post } = req.params;

        try {
            const querySelStation = {
                text: `
                    SELECT  *
                    FROM    posts
                    WHERE   post_id=$1
                    LIMIT   1;
                `,
                values: [ post ]
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
    },

    /**
     * Gets all the posts form a given user
     */
    getUserPosts: async (req, res) => {
        const { username } = req.params;
        const { offset, limit } = req.query;

        const queryUser = {
            text: `
                SELECT  *
                FROM    users
                WHERE   username=$1
                LIMIT   1
            `,
            values: [
                username
            ]
        };

        const queryUserPosts = {
            text: `
                SELECT      *
                FROM        posts
                WHERE       author=$1
                ORDER BY    timestamp_created DESC
                OFFSET      $2
                LIMIT       $3;
            `,
            values: [ 
                username,
                offset,
                limit
            ]
        };

        try {
            const { rowCount } = await db.query(queryUser);

            if (!rowCount) {
                return res.status(404).send();
            }

            const result = await db.query(queryUserPosts);

            return res.status(200).send({
                posts: result.rows
            });
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
            text
        } = req.body;
        const author = req.user.username;
        const station_name = req.params.station;

        try {

            // Insert post into posts table
            const queryInsPost = {
                text: `
                    INSERT INTO posts(post_id, title, text, author, station_name) 
                        VALUES(post_id(), $1, $2, $3, $4)
                    RETURNING post_id;
                `,
                values: [
                    title,
                    text,
                    author,
                    station_name
                ]
            };

            const resultPost = await db.query(queryInsPost);
            const postId = resultPost.rows[0].post_id;

            return res.status(201).send({ postId });
        } catch (err) {
            console.log(err);            

            return res.status(500).send();
        }
    }

    // PUT

    // DELETE
};

module.exports = postAPI;