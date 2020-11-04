const db = require('../db');

const indexAPI = {
    /**
     * Sends the index page
     */
    index: (_req, res) => {
        res.send('Hello World');
    },

    query: async (_req, res) => {
        try {
            const query = {
                text: `
                    SELECT  *
                    FROM    test;
                `
            };

            const result = await db.query(query);

            return res.send(result.rows);
        } catch (err) {
            console.log(err);
            return res.status(500).send('Error');
        }
    }
};

module.exports = indexAPI;