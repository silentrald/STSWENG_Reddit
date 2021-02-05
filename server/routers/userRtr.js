const router = require('express')();
const api = require('../api/userAPI');
const mw = require('../middlewares/userMw');
const queryStrMw = require('../middlewares/queryStringMw');
const loginMw = require('../middlewares/loginMw');
const userMw = require('../middlewares/userMw');
//const queryMw = require('../middlewares/queryMw');

// GET
router.get('/auth', api.getAuth);

router.get('/',
    queryStrMw.sanitizeSearch,
    queryStrMw.sanitizeOffsetAndLimit,
    api.getUserNames);

router.get('/profile/:username',
    userMw.validateUserParam,
    api.getUser);

// POST

router.post('/create',
    loginMw.isNotAuth,
    mw.validateRegisterUser,
    api.postRegisterUser);

router.post('/login',
    loginMw.isNotAuth,
    loginMw.validateLogin,
    api.postLogin);

// PATCH

router.patch('/profile/:username',
    loginMw.isAuth,
    mw.validateUserProfile,
    api.patchUser);

// DELETE

module.exports = router;