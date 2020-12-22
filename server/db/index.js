const { Pool } = require('pg');

const config = process.env.NODE_ENV === 'development' ?
    {
        user:       process.env.POSTGRES_USER,
        password:   process.env.POSTGRES_PASSWORD,
        host:       process.env.POSTGRES_HOST,
        port:       process.env.POSTGRES_PORT,
        database:   process.env.POSTGRES_DB
    } : {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    };

const pool = new Pool(config);

module.exports = {
    query: (text, values) => pool.query(text, values),
    connect: () => pool.connect(),
    end: () => pool.end()
};