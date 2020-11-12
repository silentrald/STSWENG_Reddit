if (!process.env.CI) {
    require('dotenv').config();
}

const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');

const config = {
    user:       process.env.POSTGRES_USER,
    password:   process.env.POSTGRES_PASS,
    host:       process.env.POSTGRES_HOST,
    port:       process.env.POSTGRES_PORT,
    database:   process.env.POSTGRES_DB
};

console.log(config);

const client = new Pool(config);

(async () => {
    try {
        const query = await fs.readFile(
            path.join(__dirname, 'sqls', 'up.sql'),
            { encoding: 'utf-8' }
        );
        await client.query(query);
        await client.end();
        console.log('Migration Up Done');
    } catch (err) {
        console.log(err);
        throw err;
    }
})();