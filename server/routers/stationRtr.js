const router = require('express')();
const api = require('../api/stationAPI');
const loginMw = require('../middlewares/loginMw');
const stationMw = require('../middlewares/stationMw');

// GET

router.get('/id/:name',
    api.getStation);

router.get('/captains/:name',
    api.getCaptains);


// POST

router.post('/new',
    loginMw.isLogin,
    stationMw.validateCreateStation,
    api.postCreateStation);

// PATCH

// DELETE

module.exports = router;