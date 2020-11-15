// MODULES
const express       = require('express');

const bodyParser    = require('body-parser');
const cors          = require('cors');

if (!process.env.CI) {
    require('dotenv').config();
}

const app = express();

const PORT = process.env.PORT | 5000;

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(require('morgan')('dev')); // import morgan
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API ROUTERS
const userRtr = require('./routers/userRtr');

app.use('/api/user', userRtr);

const server = app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

module.exports = server;