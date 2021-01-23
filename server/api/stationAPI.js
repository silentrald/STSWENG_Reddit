const db = require('../db');

const stationAPI = {
    // GET
    getStation: async (req, res) => {
        const { stationName } = req.params;

        try {
            let result = {};

            const querySelStation = {
                text: 'SELECT * FROM stations WHERE name = $1 LIMIT 1;',
                values: [ stationName ]
            };

            const { rows, rowCount } = await db.query(querySelStation);
            if (rowCount < 1) {
                return res.status(404).send();
            }

            result.station = rows[0];

            // Optionally, if the user is logged in, another property, joined,
            // is added to indicate whether the user is joined or not.
            if (req.user) {
                const querySelCaptains = {
                    text: 'SELECT * FROM captains WHERE username = $1 AND station_name = $2 LIMIT 1;',
                    values: [ req.user.username, stationName ]
                };

                const { rows: captainRows } = await db.query(querySelCaptains);
                result.isCaptain = captainRows.length > 0;
                result.joined = captainRows.length > 0;
                if (!result.isCaptain) {
                    const querySelPassengers = {
                        text: 'SELECT * FROM passengers WHERE username = $1 AND station_name = $2 LIMIT 1;',
                        values: [ req.user.username, stationName ]
                    };
    
                    const { rows: passengerRows } = await db.query(querySelPassengers);
                    result.joined = passengerRows.length > 0;
                }
            }
            
            return res.status(200).send(result);
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    /**
     * Gets a list of stations depending on the
     * filter string passed
     */
    getStationNames: async (req, res) => {
        const {
            search,
            offset,
            limit
        } = req.query;

        try {
            const querySelStations = {
                text: `
                    SELECT  name
                    FROM    stations
                    WHERE   name ILIKE $1
                    OFFSET  $2
                    LIMIT   $3;
                `,
                values: [
                    search ? search : '%',
                    offset,
                    limit
                ]
            };

            const { rows: stations, rowCount } = await db.query(querySelStations);
            if (rowCount < 1) {
                return res.status(404).send();
            }

            return res.status(200).send({ stations });
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    /**
     * Gets the top stations
     */
    getTopStations: async (_req, res) => {
        try {
            // TODO: add more algorithms here
            // (a * t) + ((1 - a) * p) = Simple Popularity algorithm
            // a = 0.05, t = time, p = popularity val
            const querySelTopStations = {
                text: `
                    SELECT      *
                    FROM        stations
                    ORDER BY    members DESC
                    LIMIT       5;
                `
            };

            const { rows: stations } = await db.query(querySelTopStations);

            return res.status(200).send({ stations });
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
            // Check if the user is a captain; this query is necessary for proper error information.
            const querySelCaptains = {
                text: 'SELECT * FROM captains WHERE username = $1 AND station_name = $2 LIMIT 1;',
                values: [ req.user.username, stationName ]
            };

            const selResult = await db.query(querySelCaptains);
            if (selResult.rowCount > 0) {
                return res.status(403).send({
                    errors: { station: 'isCaptain' }
                });
            }

            const queryDelCrewmates = {
                text: 'DELETE FROM crewmates WHERE username = $1 AND station_name = $2;',
                values: [ req.user.username, stationName ]
            };

            // Test that captains cannot leave the station without first being demoted to crewmate.

            // This endpoint allows users to leave a station that is already archived.
            const delResult = await db.query(queryDelCrewmates);
            if (delResult.rowCount < 1) {
                return res.status(403).send({
                    errors: { station: 'notJoined' }
                });
            }

            return res.status(200).send();
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    postUpdateInfo: async (req, res) => {
        const { stationName } = req.params;
        const { rules, description } = req.body;

        const client = await db.connect();

        try {
            await client.query('BEGIN');

            const queryUpdStation = {
                text: `
                    UPDATE stations
                    SET description = $1, rules = $2
                    WHERE name = $3;
                `,
                values: [ description, rules, stationName ]
            };

            const { rowCount } = await client.query(queryUpdStation);
            if (rowCount !== 1) {
                return res.status(403).send({
                    errors: { station: 'isCaptain' }
                });
            }

            await client.query('COMMIT');

            return res.status(200).send();
        } catch (err) {
            try {
                await client.query('ROLLBACK');
            } catch (rollbackErr) {
                console.log(rollbackErr);
            }

            console.log(err);
            return res.status(500).send();
        } finally {
            client.release();
        }
    },

    postEditRoles: async (req, res) => {
        const { stationName } = req.params;
        const { type, username } = req.body;

        // prevent captain from demoting themselves
        if (username === req.user.username) {
            return res.status(403).send({
                errors: {
                    username: 'sameUser'
                }
            });
        }

        const client = await db.connect();

        try {
            await client.query('BEGIN');

            const querySelCaptains = {
                text: `
                    SELECT *
                    FROM captains
                    WHERE station_name = $1 AND username = $2
                    LIMIT 1
                `,
                values: [ stationName, username ]
            };
            const { rows: captains } = await client.query(querySelCaptains);
            const isCaptain = captains.length > 0;

            const querySelCrewmates = {
                text: `
                    SELECT *
                    FROM crewmates
                    WHERE station_name = $1 AND username = $2
                    LIMIT 1
                `,
                values: [ stationName, username ]
            };
            const { rows: crewmates } = await client.query(querySelCrewmates);
            const isCrewmate = crewmates.length > 0;

            if (type === 'grant') {
                if (isCrewmate && !isCaptain) {
                    const queryDelCrewmates = {
                        text: `
                            DELETE FROM crewmates
                            WHERE station_name = $1 AND username = $2
                        `,
                        values: [ stationName, username ]
                    };
                    const { rowCount: delCrewmates } = await client.query(queryDelCrewmates);
                    if (delCrewmates === 0) throw Error('Failed to delete crewmate');

                    const queryInsCaptains = {
                        text: `
                            INSERT INTO captains
                            (station_name, username, date_join)
                            VALUES ($1, $2, $3)
                        `,
                        values: [ stationName, username, crewmates[0].date_join ]
                    };
                    const { rowCount: insCaptains } = await client.query(queryInsCaptains);
                    if (insCaptains === 0) throw Error('Failed to insert captain');

                    await client.query('COMMIT');
                    return res.status(200).send();
                } else if (!isCrewmate && isCaptain) {
                    client.query('ROLLBACK');
                    return res.status(403).send({
                        errors: {
                            username: 'isCaptain'
                        }
                    });
                } else if (isCaptain && isCrewmate) {
                    throw Error('user is both captain and crewmate');
                } else {
                    client.query('ROLLBACK');
                    return res.status(403).send({
                        errors: {
                            username: 'notJoined'
                        }
                    });
                }
            } else if (type === 'revoke') {
                if (isCrewmate && !isCaptain) {
                    client.query('ROLLBACK');
                    return res.status(403).send({
                        errors: {
                            username: 'isNotCaptain'
                        }
                    });
                } else if (!isCrewmate && isCaptain) {
                    const queryDelCaptains = {
                        text: `
                            DELETE FROM captains
                            WHERE station_name = $1 AND username = $2
                        `,
                        values: [ stationName, username ]
                    };
                    const { rowCount: delCaptains } = await client.query(queryDelCaptains);
                    if (delCaptains === 0) throw Error('Failed to delete captain');

                    const queryInsCrewmates = {
                        text: `
                            INSERT INTO crewmates
                            (station_name, username, date_join)
                            VALUES ($1, $2, $3)
                        `,
                        values: [ stationName, username, captains[0].date_join ]
                    };
                    const { rowCount: insCrewmates } = await client.query(queryInsCrewmates);
                    if (insCrewmates === 0) throw Error('Failed to insert crewmate');

                    await client.query('COMMIT');
                    return res.status(200).send();
                } else if (isCaptain && isCrewmate) {
                    throw Error('user is both captain and crewmate');
                } else {
                    client.query('ROLLBACK');
                    return res.status(403).send({
                        errors: {
                            username: 'notJoined'
                        }
                    });
                }
            } else {
                client.query('ROLLBACK');
                return res.status(403).send({
                    errors: {
                        type: 'invalid'
                    }
                });
            }
        } catch (err) {
            try {
                await client.query('ROLLBACK');
            } catch (rollbackErr) {
                console.log(rollbackErr);
            }

            console.log(err);
            return res.status(500).send();
        } finally {
            client.release();
        }
    }

    // PATCH

    // DELETE
};

module.exports = stationAPI;