const router = require('express')();
const api = require('../api/commentAPI');
const mw = require('../middlewares/commentMw');
const loginMw = require('../middlewares/loginMw');
const postMw = require('../middlewares/postMw');
const queryMw = require('../middlewares/queryMw');

// GET
router.get('/post/:post',
    postMw.validatePostParam,
    mw.sanitizeSubpostsQuery,
    api.getSubposts);

router.get('/c/:comment',
    mw.validateCommentParams,
    mw.sanitizeSubcommentsQuery,
    api.getSubcomments);

// POST
router.post('/post/:post',
    loginMw.isAuth,
    postMw.validatePostParam,
    mw.validateComment,
    queryMw.userIsPartOfStation,
    api.postSubpost);

router.post('/c/:comment',
    loginMw.isAuth,
    mw.validateCommentParams,
    postMw.validatePostBody,
    mw.validateComment,
    queryMw.userIsPartOfStation,
    api.postSubcomment);

// PATCH

router.patch('/:comment',
    loginMw.isAuth,
    mw.validateCommentParams,
    mw.validateText,
    queryMw.commentNotDeleted,
    api.patchComment);

// DELETE

router.delete('/:comment',
    loginMw.isAuth,
    mw.validateCommentParams,
    queryMw.commentNotDeleted,
    api.deleteComment);

module.exports = router;