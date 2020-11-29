const db = require('../db');

const postAPI = {
    // GET
    getStationPosts: async (req, res) => {
        const { station } = req.params;
        const { offset, limit, sort } = req.query;

        try {
            const queryStationPosts = {
                text: `
                    SELECT      *
                    FROM        posts
                    WHERE       station_name=$1
                    ORDER BY    timestamp_created ${sort}
                    OFFSET      $2
                    LIMIT       $3;
                `,
                values: [
                    station,
                    offset,
                    limit
                ]
            };

            const results = await db.query(queryStationPosts);
            const posts = results.rows;

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