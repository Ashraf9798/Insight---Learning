const express = require('express');
const router = express.Router();
const { getNews } = require('../controllers/news');
const { asyncErrorHandler } = require('../middleware/index');


router.get('/news', asyncErrorHandler(getNews));

module.exports = router;