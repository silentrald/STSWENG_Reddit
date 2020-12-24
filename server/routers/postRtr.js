const router = require('express')();
const api = require('../api/postAPI');
// const loginMw = require('../middlewares/loginMw');
const mw = require('../middlewares/postMw');

// GET
router.get('/:post',
    mw.validatePostParam,
    api.getStationPost);

router.get('/station/:station',
    mw.validateStationParam,
    mw.sanitizePostsQuery,
    api.getStationPosts);

// POST

// PATCH

// DELETE

module.exports = router;