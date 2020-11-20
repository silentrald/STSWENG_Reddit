const router = require('express')();
const api = require('../api/stationAPI');
const loginMw = require('../middlewares/loginMw');

// GET

router.get('/id/:name',
    api.getStation);

router.get('/captains/:name',
    api.getCaptains);


// POST

router.post('/new',
    loginMw.isLogin,
    api.postCreateStation);

// PATCH

// DELETE

module.exports = router;