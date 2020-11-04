const router = require('express')();
const api = require('../api/indexAPI');

router.get('/', api.index);
router.get('/query', api.query);

module.exports = router;