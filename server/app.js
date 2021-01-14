// MODULES
const express       = require('express');

const bodyParser    = require('body-parser');
const cors          = require('cors');

if (!process.env.CI) {
    require('dotenv').config();
}

const app = express();

const PORT = process.env.PORT || 5000;

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(require('morgan')('dev')); // import morgan
}

// const corsOptions = {
//     origin: process.env.CLIENT_URL,
//     optionsSuccessStatus: 200
// };
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CUSTOM MIDDLEWARES
const loginMw = require('./middlewares/loginMw');

app.use(loginMw.smartLogin);

// API ROUTERS
const commentRtr = require('./routers/commentVoteRtr');
const postRtr = require('./routers/postRtr');
const postVoteRtr = require('./routers/postVoteRtr');
const subcommentRtr = require('./routers/subcommentRtr');
const subpostRtr = require('./routers/subpostRtr');
const stationRtr = require('./routers/stationRtr');
const userRtr = require('./routers/userRtr');

app.use('/api/comment-vote', commentRtr);
app.use('/api/post', postRtr);
app.use('/api/post-vote', postVoteRtr);
app.use('/api/subcomment', subcommentRtr);
app.use('/api/subpost', subpostRtr);
app.use('/api/station', stationRtr);
app.use('/api/user', userRtr);

const server = app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

module.exports = server;