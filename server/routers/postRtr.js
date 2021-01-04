const router = require('express')();
const api = require('../api/postAPI');
const loginMw = require('../middlewares/loginMw');
const stationMw = require('../middlewares/stationMw');
const mw = require('../middlewares/postMw');

// GET

router.get('/',
    mw.sanitizePostsQuery,
    api.getPosts);
    
router.get('/:post',
    mw.validatePostParam,
    api.getStationPost);

router.get('/station/:station',
    mw.validateStationParam,
    mw.sanitizePostsQuery,
    api.getStationPosts);

// POST

router.post('/station/:station',
    loginMw.isAuth,
    stationMw.userIsPartOfStation,
    mw.validateStationParam,
    mw.validateSationPost,
    api.postStationPost);

// PATCH

// DELETE

module.exports = router;