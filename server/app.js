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

let allowedOrigins = [
    'http://localhost:3000'
];

app.use(cors({
    credentials: true,
    origin: function(origin, callback) {
        // Allow requests with no origin
        // (e.g. mobile apps and curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        let msg = 'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
    }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CUSTOM MIDDLEWARES
const loginMw = require('./middlewares/loginMw');

app.use(loginMw.smartLogin);

// API ROUTERS
const stationRtr = require('./routers/stationRtr');
const userRtr = require('./routers/userRtr');

app.use('/api/station', stationRtr);
app.use('/api/user', userRtr);

const server = app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

module.exports = server;