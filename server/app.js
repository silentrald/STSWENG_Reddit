// MODULES
const express       = require('express');

const bodyParser    = require('body-parser');
const cors          = require('cors');

if (!process.env.CI) {
    require('dotenv').config();
}

const app = express();

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(require('morgan')('dev')); // import morgan
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CUSTOM MIDDLEWARES
const loginMw = require('./middlewares/loginMw');

app.use(loginMw.smartLogin);

// API ROUTERS
const commentRtr = require('./routers/commentRtr');
const commentVoteRtr = require('./routers/commentVoteRtr');
const postRtr = require('./routers/postRtr');
const postVoteRtr = require('./routers/postVoteRtr');
const stationRtr = require('./routers/stationRtr');
const userRtr = require('./routers/userRtr');
const verficationRtr = require('./routers/verificationRtr');

app.use('/api/comment', commentRtr);
app.use('/api/comment-vote', commentVoteRtr);
app.use('/api/post', postRtr);
app.use('/api/post-vote', postVoteRtr);
app.use('/api/station', stationRtr);
app.use('/api/user', userRtr);
app.use('/api/verification', verficationRtr);

const server = app.listen(PORT, HOST, () => {
    console.log(`Listening to port ${PORT}`);
});

module.exports = server;