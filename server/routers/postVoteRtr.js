const router = require('express')();
const api = require('../api/postVoteAPI');
const loginMw = require('../middlewares/loginMw');
const postMw = require('../middlewares/postMw');
const queryMw = require('../middlewares/queryMw');
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
    queryMw.getStationPostParams,
    queryMw.userIsPartOfStation,
    api.postPostVote);

// PATCH

// DELETE

module.exports = router;