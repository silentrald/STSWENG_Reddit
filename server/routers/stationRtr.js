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

router.post('/create',
    loginMw.isLogin,
    stationMw.validateCreateStation,
    api.postCreateStation);

router.post('/join/:stationName',
    loginMw.isLogin,
    api.postJoinStation);

router.post('/leave/:stationName',
    loginMw.isLogin,
    api.postLeaveStation);

// PATCH

// DELETE

module.exports = router;