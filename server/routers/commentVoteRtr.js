const router = require('express')();
const api = require('../api/commentVoteAPI');
const loginMw = require('../middlewares/loginMw');
const commentMw = require('../middlewares/commentMw');
const queryMw = require('../middlewares/queryMw');
const voteMw = require('../middlewares/voteMw');

// GET
router.get('/:comment',
    loginMw.isAuth,
    commentMw.validateCommentParams,
    api.getCommentVote);

// POST
router.post('/:comment',
    loginMw.isAuth,
    commentMw.validateCommentParams,
    queryMw.getStationCommentParams,
    queryMw.userIsPartOfStation,
    voteMw.validateUpvoteBody,
    queryMw.commentNotDeleted,
    api.postCommentVote);

// PATCH

// DELETE

module.exports = router;