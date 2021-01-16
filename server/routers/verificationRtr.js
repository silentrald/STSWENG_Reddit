const router = require('express')();
const api = require('../api/verificationAPI');
// const mw = require('../middlewares/userMw');
const loginMw = require('../middlewares/loginMw');

// GET

// POST
router.post('/',
    loginMw.isAuth,
    api.postSendVerification);

router.post('/verify',
    api.postVerification);

// PATCH

// DELETE

module.exports = router;