const router = require('express')();
const api = require('../api/userAPI');
const mw = require('../middlewares/userMw');

// GET

// POST
router.post('/create',
    mw.validateRegisterUser,
    api.postRegisterUser);

// PATCH

// DELETE

module.exports = router;