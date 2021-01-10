const router = require('express')();
const api = require('../api/subpostAPI');
const loginMw = require('../middlewares/loginMw');
const mw = require('../middlewares/subpostMw');
const postMw = require('../middlewares/postMw');
// const loginMw = require('../middlewares/loginMw');

// GET
router.get('/post/:post',
    postMw.validatePostParam,
    mw.sanitizeSubpostsQuery,
    api.getPostSubposts);

// POST
router.post('/post/:post',
    loginMw.isAuth,
    postMw.validatePostParam,
    mw.validateComment,
    api.postSubpost);

// PATCH

// DELETE

module.exports = router;