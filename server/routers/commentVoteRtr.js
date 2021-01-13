const router = require('express')();
const api = require('../api/commentVoteAPI');
const loginMw = require('../middlewares/loginMw');
const subcommentMw = require('../middlewares/subcommentMw');
const queryMw = require('../middlewares/queryMw');
const voteMw = require('../middlewares/voteMw');

// GET
router.get('/:comment',
    loginMw.isAuth,
    subcommentMw.validateCommentParams,
    api.getCommentVote);

// POST
router.post('/:comment',
    loginMw.isAuth,
    subcommentMw.validateCommentParams,
    queryMw.getStationCommentParams,
    queryMw.userIsPartOfStation,
    voteMw.validateUpvoteBody,
    api.postCommentVote);

// PATCH

// DELETE

module.exports = router;