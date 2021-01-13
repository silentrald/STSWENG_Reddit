const router = require('express')();
const api = require('../api/stationAPI');
const loginMw = require('../middlewares/loginMw');
const stationMw = require('../middlewares/stationMw');

// GET

router.get('/id/:stationName',
    api.getStation);

router.get('/top',
    api.getTopStations);

router.get('/captains/:stationName',
    api.getStationCaptains);


// POST

router.post('/info/:stationName',
    loginMw.isAuth,
    stationMw.validateCreateStation,
    stationMw.isCaptain,
    api.postUpdateInfo);

router.post('/create',
    loginMw.isAuth,
    stationMw.validateCreateStation,
    api.postCreateStation);

router.post('/join/:stationName',
    loginMw.isAuth,
    stationMw.validateStationParam,
    api.postJoinStation);

router.post('/leave/:stationName',
    loginMw.isAuth,
    stationMw.validateStationParam,
    api.postLeaveStation);

// PATCH

// DELETE

module.exports = router;