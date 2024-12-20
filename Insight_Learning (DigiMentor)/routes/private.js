const express = require('express');
const router = express.Router();
const { getChatPage, postChatPage } = require('../controllers/private');
const { asyncErrorHandler } = require('../middleware/index');

router.get('/chat/:name', asyncErrorHandler(getChatPage));

router.post('/chat/:name', asyncErrorHandler(postChatPage));


module.exports = router;