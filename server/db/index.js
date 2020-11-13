const { Pool } = require('pg');

const pool = new Pool({
    user:       process.env.POSTGRES_USER,
    password:   process.env.POSTGRES_PASSWORD,
    host:       process.env.POSTGRES_HOST,
    port:       process.env.POSTGRES_PORT,
    database:   process.env.POSTGRES_DB
});

module.exports = {
    query: (text, values) => pool.query(text, values),
    connect: () => pool.connect(),
    end: () => pool.end()
};