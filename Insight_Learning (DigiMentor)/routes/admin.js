const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const { storage } = require('../helpers/cloudinary');
const upload = multer({ storage });
const { adminPage, createPage } = require('../controllers/admin');
const { asyncErrorHandler } = require('../middleware/index');

router.get('/dashboard', adminPage);

router.post('/dashboard', upload.single('image'), asyncErrorHandler(createPage));

module.exports = router;
