const router = require('express')();
const api = require('../api/userAPI');
const mw = require('../middlewares/userMw');
const queryStrMw = require('../middlewares/queryStringMw');
const loginMw = require('../middlewares/loginMw');

// GET
router.get('/auth', api.getAuth);

router.get('/',
    queryStrMw.sanitizeSearch,
    queryStrMw.sanitizeOffsetAndLimit,
    api.getUserNames);

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

// DELETE

module.exports = router;