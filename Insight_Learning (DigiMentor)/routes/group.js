const express = require('express');
const router = express.Router();
const { groupPage, postGroupPage } = require('../controllers/group');
const { asyncErrorHandler } = require('../middleware/index');

router.get('/group/:name', asyncErrorHandler(groupPage));

router.post('/group/:name', asyncErrorHandler(postGroupPage));

module.exports = router;