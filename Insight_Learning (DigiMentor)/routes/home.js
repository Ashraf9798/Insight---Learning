const express = require('express');
const router = express.Router();
const { homepage, addFavourites } = require('../controllers/home');
const { asyncErrorHandler } = require('../middleware/index');

router.get('/home', asyncErrorHandler(homepage));

router.post('/home', asyncErrorHandler(addFavourites));


module.exports = router;