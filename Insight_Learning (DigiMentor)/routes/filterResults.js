const express = require('express');
const router = express.Router();
const { getFilterResults, postFilterResults } = require('../controllers/filterResults');
const { asyncErrorHandler } = require('../middleware/index');

router.get('/results', asyncErrorHandler(getFilterResults));

router.post('/results', asyncErrorHandler(postFilterResults));

module.exports = router;