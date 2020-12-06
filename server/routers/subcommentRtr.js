const router = require('express')();
const api = require('../api/subcommentAPI');
const mw = require('../middlewares/subcommentMw');
const loginMw = require('../middlewares/loginMw');

// GET
router.get('/comment/:comment',
    mw.validateCommentParams,
    mw.sanitizeSubcommentsQuery,
    api.getPostSubcomments);

// POST
router.post('/create',
    loginMw.isAuth,
    mw.validateSubcomment,
    api.postSubcomment);

// PATCH

// DELETE

module.exports = router;