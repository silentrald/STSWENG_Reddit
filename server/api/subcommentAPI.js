
const db = require('../db');

const subcommentAPI = {
    // GET

    // POST
    /**
     * 
     * 
     */
    postSubcomment: async (req, res) => {
        const { 
            parentComment, 
            text,
            station
        } = req.body;

        const author = req.user.username;
        let commentID;

        try {
            // Check if the user is a crewmate/captain of the station
            const queryPassenger = {
                text: `
                    SELECT  *
                    FROM    passengers
                    WHERE   username=$1
                    AND     station_name=$2
                    LIMIT   1;
                `,
                values: [
                    author,
                    station
                ]
            };

            const resultPassenger = await db.query(queryPassenger);

            if (resultPassenger.rowCount < 1) {
                console.log('User is not a passenger of the station');
                return res.status(403).send({ error: 'NOT_PSNGR' });
            }

            // Check if the parent comment is in the station
            const queryComment = {
                text: `
                    SELECT  *
                    FROM    comments
                    WHERE   comment_id=$1
                    LIMIT   1;
                `,
                values: [ parentComment ]
            };
            
            const resultComment = await db.query(queryComment);

            if (resultComment.rowCount < 1) {
                console.log(`Parent Comment(${parentComment}) does not exist`);
                return res.status(403).send({ error: 'PRT_CMT_NONE' });
            }

            if (resultComment.rows[0].station_name !== station) {
                console.log(`Parent Comment(${parentComment}) is not inside the station(${station})`);
                return res.status(403).send({ error: 'INV_PRT_CMT' });
            } 

            const client = await db.connect();

            try {
                await client.query('BEGIN');

                const queryInsComment = {
                    text: `
                        INSERT INTO comments(comment_id, text, author, station_name)
                            VALUES(comment_id(), $1, $2, $3)
                        RETURNING comment_id;
                    `,
                    values: [
                        text,
                        author,
                        station
                    ]
                };
    
                const resultComment = await client.query(queryInsComment);

                commentID = resultComment.rows[0].comment_id;

                const queryInsSubcomment = {
                    text: `
                        INSERT INTO subcomments(parent_comment, comment_id)
                            VALUES($1, $2);
                    `,
                    values: [
                        parentComment,
                        commentID
                    ]
                };

                await client.query(queryInsSubcomment);

                await client.query('COMMIT');
            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            } finally {
                await client.release();
            }

            return res.status(201).send({ comment: commentID });
        } catch (err) {
            console.log(err);

            if (err.code === '23503') {
                if (err.constraint === 'pk_subcomments') { // there is already column
                    return res.status(403).send({ error: 'EXISTS' });
                }
            }

            return res.status(500).send();
        }
    }

    // PATCH

    // DELETE

};

module.exports = subcommentAPI;