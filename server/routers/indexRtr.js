const router = require('express')();
const api = require('../api/indexAPI');

router.get('/', api.index);

module.exports = router;