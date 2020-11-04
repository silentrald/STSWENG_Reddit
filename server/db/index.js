const { Pool } = require('pg');

const pool = new Pool({
    user:       process.env.PG_USER,
    password:   process.env.PG_PASS,
    host:       process.env.PG_HOST,
    port:       process.env.PG_PORT,
    database:   process.env.PG_DB
});

module.exports = {
    query: (text, values) => pool.query(text, values),
    connect: () => pool.connect(),
};