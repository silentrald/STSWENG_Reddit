const router = require('express')();
const api = require('../api/postVoteAPI');
// const loginMw = require('../middlewares/loginMw');
// const Mw = require('../middlewares/postVoteMw');

// GET
router.get('/score/:post',
    api.getScore);

// POST

// PATCH

// DELETE

module.exports = router;