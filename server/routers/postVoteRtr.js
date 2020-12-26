const router = require('express')();
const api = require('../api/postVoteAPI');
const loginMw = require('../middlewares/loginMw');
const postMw = require('../middlewares/postMw');
// const mw = require('../middlewares/postVoteMw');

// GET
router.get('/:post',
    loginMw.isAuth,
    postMw.validatePostParam,
    api.getPostVote);

// POST
router.post('/:post',
    loginMw.isAuth,
    postMw.validatePostParam,
    api.postPostVote);

// PATCH

// DELETE

module.exports = router;