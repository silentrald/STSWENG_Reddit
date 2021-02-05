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

    /**
     * Gets the user depending on the search
     * filter provided
     */
    getUserNames: async (req, res) => {
        const {
            search,
            offset,
            limit
        } = req.query;

        try {
            const querySelUsers = {
                text: `
                    SELECT  username
                    FROM    users
                    WHERE   username ILIKE $1
                    OFFSET  $2
                    LIMIT   $3;
                `,
                values: [
                    search ? search : '%',
                    offset,
                    limit
                ]
            };

            const { rows: users, rowCount } = await db.query(querySelUsers);
            if (rowCount < 1) {
                return res.status(404).send();
            }

            return res.status(200).send({ users });
        } catch (err) {
            console.log(err);

            return res.status(500).send();
        }
    },

    /**
     * Gets the details of the user specified in the params, including their total fame
     */
    getUser: async (req, res) => {
        const { username } = req.params;

        try {
            // Get user details
            const queryGetUser = {
                text: `
                    SELECT  username, fname, lname, gender, to_char(birthday, 'YYYY-MM-DD') AS birthday, bio, fame
                    FROM    users
                    WHERE   username=$1
                    LIMIT   1;
                `,
                values: [ username ]
            };
            const result = await db.query(queryGetUser);

            // Check if user exists
            if (!result.rowCount) {
                return res.status(404).send();
            }

            console.log(result);

            return res.status(200).send({
                user: result.rows[0] 
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send();
        }
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
            
            // Send to the server that the account was created
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
                }
                // else if (err.constraint === 'users_email_key') {
                //     return res.status(401).send({ 
                //         errors: {
                //             email: 'used' // Email is used
                //         }
                //     });
                // }
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
    },

    // PATCH

    /**
     * Updates the details of the user as specified
     * in the req body. Required fields:
     * fname, lname, bio, birthday, gender
     */
    patchUser: async (req, res) => {
        const profile = req.body;

        const queryUpdateUser = {
            text: `
                UPDATE      users
                SET         (fname, lname, gender, birthday, bio)
                    =       ($2, $3, $4, $5, $6)
                WHERE       username=$1
                RETURNING   username;
            `,
            values: [
                req.params.username,
                profile.fname,
                profile.lname,
                profile.gender,
                profile.birthday,
                profile.bio
            ]
        };

        try {
            const result = await db.query(queryUpdateUser);
            console.log(result);
            if (!result.rowCount) {
                return res.status(404).send();
            }

            return res.status(200).send();
        } catch (err) {
            console.log(err);
            return res.status(500).send();
        }
    }

    // DELETE
};

module.exports = userAPI;