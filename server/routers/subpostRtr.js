const router = require('express')();
const api = require('../api/subpostAPI');
const mw = require('../middlewares/subpostMw');
const postMw = require('../middlewares/postMw');
// const loginMw = require('../middlewares/loginMw');

// GET
router.get('/post/:post',
    postMw.validatePostParam,
    mw.sanitizeSubpostsQuery,
    api.getPostSubposts);

// POST

// PATCH

// DELETE

module.exports = router;