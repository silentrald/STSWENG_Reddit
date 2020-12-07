const router = require('express')();
const api = require('../api/subcommentAPI');
const mw = require('../middlewares/subcommentMw');
const loginMw = require('../middlewares/loginMw');

// GET

// POST
router.post('/create',
    loginMw.isAuth,
    mw.validateSubcomment,
    api.postSubcomment);

// PATCH

// DELETE

module.exports = router;