const router = require('express')();
const api = require('../api/postAPI');
// const loginMw = require('../middlewares/loginMw');
const mw = require('../middlewares/postMw');

// GET
router.get('/station/:station',
    mw.validateStationParam,
    mw.sanitizePostsQuery,
    api.getStationPosts);

// POST
// TODO: Add middleware
router.post('/station/:station',
    api.postStationPost),


// PATCH

// DELETE

module.exports = router;