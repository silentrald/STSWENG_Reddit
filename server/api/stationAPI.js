const db = require('../db');

const stationAPI = {
    // GET

    // POST
    postCreateStation: async (req, res) => {
        // Get values
        const {
            name,
            description,
            rules
        } = req.body;

        try {
            // Insert query to users table
            const queryInsUser = {
                text: `
                    INSERT INTO stations(name, description, rules, date_created)
                        VALUES($1, $2, $3, $4)
                    RETURNING *;
                `,
                values: [
                    name,
                    description,
                    rules,
                    Date.now()
                ]
            };

            const { rows } = await db.query(queryInsUser);
            // Get the returned station
            const station = rows[0];

            return res.status(201).send({ station });
        } catch (err) {
            console.log(err);

            if (err.code === '23505') {
                if (err.constraint === 'stations_pkey') {
                    return res.status(401).send({ error: `Station '${name}' already exists` });
                }
            }

            return res.status(500).send();
        }
    },

    // PATCH

    // DELETE
};

module.exports = stationAPI;