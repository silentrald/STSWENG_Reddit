const router = require('express')();
const api = require('../api/stationAPI');
const loginMw = require('../middlewares/loginMw');

// GET

router.get('/id/:name',
    api.getStation);

// POST

router.post('/new',
    loginMw.isLogin,
    api.postCreateStation);

// PATCH

// DELETE

module.exports = router;