require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');

const client = new Pool({
    user:       process.env.POSTGRES_USER,
    password:   process.env.POSTGRES_PASS,
    host:       process.env.POSTGRES_HOST,
    port:       process.env.POSTGRES_PORT,
    database:   process.env.POSTGRES_DB
});

(async () => {
    try {
        const query = await fs.readFile(
            path.join(__dirname, 'sqls', 'down.sql'),
            { encoding: 'utf-8' }
        );
        await client.query(query);
        await client.end();
        console.log('Migration Down Done');
    } catch (err) {
        console.log(err);
        throw err;
    }
})();
