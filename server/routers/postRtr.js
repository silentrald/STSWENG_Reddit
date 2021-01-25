const router = require('express')();
const api = require('../api/postAPI');
const loginMw = require('../middlewares/loginMw');
const queryMw = require('../middlewares/queryMw');
const queryStrMw = require('../middlewares/queryStringMw');
const mw = require('../middlewares/postMw');

// GET

router.get('/',
    mw.sanitizePostsQuery,
    queryStrMw.sanitizeSearch,
    queryStrMw.sanitizeOffsetAndLimit,
    api.getPosts);
    
router.get('/:post',
    mw.validatePostParam,
    api.getPost);

router.get('/station/:station',
    mw.validateStationParam,
    mw.sanitizePostsQuery,
    queryStrMw.sanitizeSearch,
    queryStrMw.sanitizeOffsetAndLimit,
    api.getStationPosts);

// POST

router.post('/station/:station',
    loginMw.isAuth,
    queryMw.userIsPartOfStation,
    mw.validateStationParam,
    mw.validateStationPost,
    api.postStationPost);

// PATCH

router.patch('/:post',
    mw.validatePostParam,
);

// DELETE

router.delete('/:post',
    loginMw.isAuth,
    queryMw.userIsAuthor,
    mw.validatePostParam,
    api.deleteStationPost);


module.exports = router;