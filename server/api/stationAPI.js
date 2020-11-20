const db = require('../db');

const stationAPI = {
    // GET
    getStation: async (req, res) => {
        const { stationName } = req.params;

        try {
            const querySelStation = {
                text: 'SELECT * FROM stations WHERE name = $1 LIMIT 1;',
                values: [ stationName ]
            };

            const { rows, rowCount } = await db.query(querySelStation);
            if (rowCount < 1) {
                return res.status(404).send();
            }
            
            const station = rows[0];
            return res.status(200).send({ station });
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    getStationCaptains: async (req, res) => {
        const { stationName } = req.params;

        try {
            const querySelStation = {
                text: 'SELECT * FROM stations WHERE name = $1;',
                values: [ stationName ]
            };

            const querySelCaptains = {
                text: 'SELECT * FROM captains WHERE station_name = $1;',
                values: [ stationName ]
            };

            const { rows } = await db.query(querySelStation);
            if (rows && rows[0]) {
                const { rows } = await db.query(querySelCaptains);
                if (rows) {
                    return res.status(200).send({ captains: rows });
                }
            }

            return res.status(404).send();
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

        const client = await db.connect();

        try {
            await client.query('BEGIN');

            // Insert query to users table
            const queryInsStation = {
                text: `
                    INSERT INTO stations(name, description, rules)
                        VALUES($1, $2, $3)
                    RETURNING *;
                `,
                values: [
                    name,
                    description,
                    rules
                ]
            };

            const s_result = await client.query(queryInsStation);
            // Get the returned station
            const station = s_result.rows[0];

            await client.query({
                text: `
                    INSERT INTO captains(username, station_name)
                        VALUES($1, $2)
                    RETURNING *;
                `,
                values: [ req.user.username, station.name ]
            });

            await client.query('COMMIT');
            return res.status(201).send({ station });
        } catch (err) {
            try {
                await client.query('ROLLBACK');
            } catch (rollbackErr) {
                console.log(rollbackErr);
            }

            console.log(err);
            if (err.code === '23505') {
                if (err.constraint === 'stations_pkey') {
                    return res.status(401).send({ errors: { name: 'used' } });
                }
            }

            return res.status(500).send();
        } finally {
            client.release();
        }
    },

    // PATCH

    // DELETE
};

module.exports = stationAPI;