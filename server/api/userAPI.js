const bcrypt = require('../modules/bcrypt');
const jwt = require('../modules/jwt');

const db = require('../db');

const userAPI = {
    // GET

    /**
     * Responds with the user details to the client
     */
    getAuth: (req, res) => {
        return req.user
            ? res.status(200).send({ user: req.user })
            : res.status(403).send();
    },

    // POST
    /**
     * Create a user and responds with a status 201.
     * If user or email already exist, return status
     * 401 and send data of 'used' with the corresponding
     * field.
     */
    postRegisterUser: async (req, res) => {
        // Get values
        const {
            username,
            password,
            email
        } = req.body;

        try {
            // Hash Password
            const hash = await bcrypt.hashSalt(password);

            // Insert query to users table
            const queryInsUser = {
                text: `
                    INSERT INTO users(username, password, email)
                        VALUES($1, $2, $3);
                `,
                values: [
                    username,
                    hash,
                    email
                ]
            };

            await db.query(queryInsUser);

            return res.status(201).send();
        } catch (err) {
            console.log(err);

            if (err.code === '23505') {
                if (err.constraint === 'users_pkey') {
                    return res.status(401).send({ 
                        errors: {
                            username: 'used' // User is used
                        }
                    });
                } else if (err.constraint === 'users_email_key') {
                    return res.status(401).send({ 
                        errors: {
                            email: 'used' // Email is used
                        }
                    });
                }
            }

            return res.status(500).send();
        }
    },

    /**
     * Searches for the user and compares the password
     * given. Responds 200 if credentials are correct else
     * 403
     */
    postLogin: async (req, res) => {
        const { username, password } = req.body;

        try {
            // Query the username from the user table
            const queryUser = {
                text: `
                    SELECT  *
                    FROM    users
                    WHERE   username=$1
                    LIMIT   1;
                `,
                values: [ username ]
            };

            const { rows, rowCount } = await db.query(queryUser);
            // No user was queried
            if (rowCount < 1) {
                return res.status(401).send();
            }

            const user = rows[0];

            const compare = await bcrypt.compare(password, user.password);

            // Passwords are not the same
            if (!compare) {
                return res.status(401).send();
            }

            // JWT Token
            delete user.password;
            delete user.banned;
            const token = await jwt.signPromise(user);

            return res.status(200).send({ token });
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    }

    // PATCH

    // DELETE
};

module.exports = userAPI;