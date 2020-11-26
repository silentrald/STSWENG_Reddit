const router = require('express')();
const api = require('../api/stationAPI');
const loginMw = require('../middlewares/loginMw');
const stationMw = require('../middlewares/stationMw');

// GET

router.get('/id/:stationName',
    api.getStation);

router.get('/captains/:stationName',
    api.getStationCaptains);


// POST

router.post('/new',
    loginMw.isAuth,
    stationMw.validateCreateStation,
    api.postCreateStation);

// PATCH

// DELETE

module.exports = router;