const router = require('express')();
const api = require('../api/postAPI');
const loginMw = require('../middlewares/loginMw');
const queryMw = require('../middlewares/queryMw');
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
    queryMw.userIsPartOfStation,
    mw.validateStationParam,
    mw.validateStationPost,
    api.postStationPost);

// PATCH

// DELETE

router.delete('/:post',
    loginMw.isAuth,
    queryMw.userIsAuthor,
    mw.validatePostParam,
    api.deleteStationPost);


module.exports = router;