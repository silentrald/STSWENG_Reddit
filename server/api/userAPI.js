const bcrypt = require('../modules/bcrypt');
const jwt = require('../modules/jwt');

const db = require('../db');

const userAPI = {
    // GET
    getAuth: (req, res) => {
        // console.log(req.user);
        
        return req.user 
            ? res.status(200).send({user: req.user})
            : res.status(403).send();
    },

    // POST
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
                        VALUES($1, $2, $3)
                    RETURNING *;
                `,
                values: [
                    username,
                    hash,
                    email
                ]
            };

            const { rows } = await db.query(queryInsUser);
            // Get the returned user
            const user = rows[0];
            delete user.password;

            // Create the token of the user and send it back to the client
            const token = await jwt.signPromise(user);

            return res.status(201).send({ token: token });
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

    postLogin: async(req, res) => {
        const { username, password } = req.body;

        try {
            // Query the username from the user table
            const queryUser = {
                text: `
                    SELECT  *
                    FROM    users
                    WHERE   username=$1;
                `,
                values: [ username ]
            };

            const { rows } = await db.query(queryUser);
            const user = rows[0];

            // No user was queried
            if (!user) {
                return res.status(401).send();
            }

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