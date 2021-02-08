const { Pool } = require('pg');
const config = process.env.NODE_ENV === 'production' ?
    {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    } :
    {
        user:       process.env.POSTGRES_USER,
        password:   process.env.POSTGRES_PASSWORD,
        host:       process.env.POSTGRES_HOST,
        port:       process.env.POSTGRES_PORT,
        database:   process.env.POSTGRES_DB
    } ;
const pool = new Pool(config);
module.exports = {
    query: (text, values) => pool.query(text, values),
    connect: () => pool.connect(),
    end: () => pool.end()
};