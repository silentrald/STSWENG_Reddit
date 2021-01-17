const router = require('express')();
const api = require('../api/commentAPI');
const mw = require('../middlewares/subcommentMw');

// GET

// POST

// PATCH

// TODO: validate text
router.patch('/:comment',
    mw.validateCommentParams,
    api.patchComment);

// DELETE

module.exports = router;