const db = require('../db');
const jwt = require('../modules/jwt');
const mailer = require('../modules/mailer');

const randomString = (n) => {
    const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let string = '';
    for (let i = 0; i < n; i++)
        string += alpha.charAt(Math.floor(Math.random() * alpha.length));
    return string;
};

const EXPIRES = 1000 * 60 * 15; // 15 mins

const verficationAPI = {
    // POST
    /**
     * Sends an email the the user
     */
    postSendVerification: async (req, res) => {
        // Create Verification Link
        // Create a random string
        try {
            const querySelUser = {
                text: `
                    SELECT  verified
                    FROM    users
                    WHERE   username=$1
                    LIMIT   1;
                `,
                values: [ req.user.username ]
            };

            const { rows: users, rowCount } = await db.query(querySelUser);
            if (rowCount < 1) {
                return res.status(404).send();
            }

            if (users[0].verified) {
                // user is already verified
                return res.status(403).send({ error: 'VRFD' });
            }
            
            let token = randomString(16);
            
            // test this
            const queryUpsertVerify = {
                text: `
                    INSERT INTO verifications(username, token)
                        VALUES($1, $2)
                    ON CONFLICT (username) DO UPDATE
                        SET expires_at=$3
                    RETURNING token;
                `,
                values: [
                    req.user.username,
                    token,
                    new Date(Date.now() - EXPIRES)
                ]
            };

            const { rows } = await db.query(queryUpsertVerify);
            token = rows[0].token;
            
            // Email the link
            const url = `${process.env.CLIENT_URL}/verify?user=${req.user.username}&key=${token}`;
            const body = `Hello ${req.user.username},

Verification Link: ${url}`;

            await mailer.sendMail(body, req.user.email, 'Verification Link');

            return res.status(200).send();
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    /**
     * Check if the verification link is valid then
     * verify the user
     */
    // TODO: int test
    postVerification: async (req, res) => {
        const { username, token } = req.body;

        try {
            // Query if the user exists in the verification table
            const querySelVerification = {
                text: `
                    SELECT  *
                    FROM    verifications
                    WHERE   username=$1
                    LIMIT   1;
                `,
                values: [ username ]
            };

            const { rows, rowCount } = await db.query(querySelVerification);
            if (rowCount < 1) {
                // invalid user
                return res.status(404).send({ error: 'ILNK' });
            }

            const verification = rows[0];
            
            // Invalid token check
            if (verification.token !== token) {
                return res.status(403).send({ error: 'ITKN' });
            }

            // Check if it already expired
            if (new Date() > verification.expires_at) {
                // Delete the verification
                const queryDelVerification = {
                    text: `
                        DELETE FROM verifications
                            WHERE username=$1;
                    `,
                    values: [ username ]
                };

                await db.query(queryDelVerification);

                // expired
                return res.status(403).send({ error: 'EXPD' });
            }

            // Valid
            const client = await db.connect();

            try {
                await client.query('BEGIN');
                // Query update the users verified status
                const queryUpUser = {
                    text: `
                        UPDATE  users
                        SET     verified=true
                        WHERE   username=$1;
                    `,
                    values: [ username ]
                };

                await client.query(queryUpUser);

                // Delete the verification
                const queryDelVerification = {
                    text: `
                        DELETE FROM verifications
                            WHERE username=$1;
                    `,
                    values: [ username ]
                };

                await client.query(queryDelVerification);
                await client.query('COMMIT');
            } catch (err) {
                client.query('ROLLBACK');
                throw err;
            } finally {
                client.release();
            }

            if (req.user && !req.user.verified) {
                req.user.verified = true;
                const token = await jwt.signPromise(req.user);
                return res.status(200).send({ token });
            } else {
                return res.status(200).send({});
            }
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    }
};

module.exports = verficationAPI;