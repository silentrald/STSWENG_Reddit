const db = require('../db');

const stationAPI = {
    // GET
    getStation: async (req, res) => {
        const { name } = req.params;

        try {
            const querySelStation = {
                text: 'SELECT * FROM stations WHERE name = $1',
                values: [ name ]
            };

            const { rows } = await db.query(querySelStation);
            if (rows && rows[0]) {
                const station = rows[0];
                return res.status(200).send({ station });
            } else {
                return res.status(404).send();
            }
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    getCaptains: async (req, res) => {
        const { name } = req.params;

        try {
            const querySelStation = {
                text: 'SELECT * FROM captains WHERE station_name = $1',
                values: [ name ]
            };

            const { rows } = await db.query(querySelStation);
            if (rows) {
                return res.status(200).send({ captains: rows });
            } else {
                return res.status(404).send();
            }
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    // POST
    postCreateStation: async (req, res) => {
        // Get values
        const {
            name,
            description,
            rules
        } = req.body;

        try {
            await db.query('BEGIN');

            // Insert query to users table
            const queryInsStation = {
                text: `
                    INSERT INTO stations(name, description, rules, date_created)
                        VALUES($1, $2, $3, $4)
                    RETURNING *;
                `,
                values: [
                    name,
                    description,
                    rules,
                    new Date(Date.now())
                ]
            };

            const s_result = await db.query(queryInsStation);
            // Get the returned station
            const station = s_result.rows[0];

            await db.query({
                text: `
                    INSERT INTO captains(username, station_name)
                        VALUES($1, $2)
                    RETURNING *;
                `,
                values: [ req.user.username, station.name ]
            });

            await db.query('COMMIT');
            return res.status(201).send({ station });
        } catch (err) {
            try {
                await db.query('ROLLBACK');
            } catch (rollbackErr) {
                console.log(rollbackErr);
            }

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