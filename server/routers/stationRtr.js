const router = require('express')();
const api = require('../api/stationAPI');
const loginMw = require('../middlewares/loginMw');

// GET

// POST

router.post('/create',
    loginMw.isLogin,
    api.postCreateStation);

// PATCH

// DELETE

module.exports = router;