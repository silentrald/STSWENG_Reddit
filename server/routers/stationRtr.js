const router = require('express')();
const api = require('../api/stationAPI');
const loginMw = require('../middlewares/loginMw');
const stationMw = require('../middlewares/stationMw');
const queryStrMw = require('../middlewares/queryStringMw');
//const queryMw = require('../middlewares/queryMw');

// GET

router.get('/id/:stationName',
    api.getStation);

router.get('/', 
    queryStrMw.sanitizeSearch,
    queryStrMw.sanitizeOffsetAndLimit,
    api.getStationNames);

router.get('/top',
    api.getTopStations);

router.get('/captains/:stationName',
    api.getStationCaptains);

router.get('/members/:stationName',
    queryStrMw.sanitizeSearch,
    queryStrMw.sanitizeOffsetAndLimit,
    api.getCrewmates);

// POST

router.post('/info/:stationName',
    loginMw.isAuth,
    stationMw.validateStationParam,
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

router.post('/roles/:stationName',
    loginMw.isAuth,
    stationMw.validateStationParam,
    stationMw.isCaptain,
    api.postEditRoles);

// PATCH

// DELETE

module.exports = router;