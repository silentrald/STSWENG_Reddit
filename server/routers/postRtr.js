const router = require('express')();
const api = require('../api/postAPI');
// const loginMw = require('../middlewares/loginMw');
const mw = require('../middlewares/postMw');

// GET
router.get('/station/:station',
    mw.validateStationParam,
    mw.sanitizePostsQuery,
    api.getStationPosts);

router.get('/station/:station/post/:post',
    mw.validatePostParam,
    mw.validateStationParam,
    api.getStationPost);

// POST

// PATCH

// DELETE

module.exports = router;