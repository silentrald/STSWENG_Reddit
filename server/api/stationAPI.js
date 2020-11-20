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
            const querySelCaptains = {
                text: 'SELECT * FROM captains WHERE station_name = $1;',
                values: [ stationName ]
            };

            const { rows, rowCount } = await db.query(querySelCaptains);
            if (rows && rowCount > 0) {
                return res.status(200).send({ captains: rows });
            }

            return res.status(404).send();
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    getIsJoined: async (req, res) => {
        const { stationName } = req.params;

        try {
            // Ensure the station exists, otherwise return 404.
            const querySelStations = {
                text: 'SELECT * FROM stations WHERE name = $1 LIMIT 1;',
                values: [ stationName ]
            };

            const sResult = await db.query(querySelStations);
            if (sResult.rowCount < 1) {
                return res.status(404).send();
            }

            const querySelPassengers = {
                text: 'SELECT * FROM passengers WHERE username = $1 AND station_name = $2 LIMIT 1;',
                values: [ req.user.username, stationName ]
            };

            const pResult = await db.query(querySelPassengers);
            return res.status(200).send({ joined: pResult.rowCount > 0 });
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

            const { rows } = await client.query(queryInsStation);
            // Get the returned station
            const station = rows[0];

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

    postJoinStation: async (req, res) => {
        const { stationName } = req.params;

        try {
            const querySelStations = {
                text: 'SELECT * FROM stations WHERE name = $1 LIMIT 1;',
                values: [ stationName ]
            };

            const sResult = await db.query(querySelStations);
            if (!sResult.rows || sResult.rowCount == 0) {
                return res.status(404).send();
            }

            if (sResult.rows[0].archived) {
                return res.status(403).send({
                    errors: { station: 'archived' }
                });
            }

            const queryInsCrewmates = {
                text: `
                    INSERT INTO crewmates(username, station_name)
                        VALUES($1, $2)
                    RETURNING *;
                `,
                values: [ req.user.username, stationName ]
            };

            // The endpoint returns 403 when the user is already joined or the station is archived.
            await db.query(queryInsCrewmates);
            return res.status(200).send();
        } catch (err) {
            console.log(err);

            if (err.code === '23505') {
                if (err.constraint === 'pk_passengers') {
                    return res.status(403).send({
                        errors: { station: 'joined' }
                    });
                }
            }

            return res.status(500).send();
        }
    },

    postLeaveStation: async (req, res) => {
        const { stationName } = req.params;

        try {
            const queryDelCrewmates = {
                text: 'DELETE FROM crewmates WHERE username = $1 AND station_name = $2;',
                values: [ req.user.username, stationName ]
            };

            // Test that captains cannot leave the station without first being demoted to crewmate.

            // The endpoint always returns 200 even when the user isn't joined in a station
            // prior to "leaving".
            // This endpoint allows users to leave a station that is already archived.
            await db.query(queryDelCrewmates);
            return res.status(200).send();
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    // PATCH

    // DELETE
};

module.exports = stationAPI;