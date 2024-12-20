const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { indexPage, getSignup, homepage, postSignup, postIndexPage, getLogout, authValidation, facebookLogin, facebookCallback, googleLogin, googleCallback } = require('../controllers/user');
const { asyncErrorHandler } = require('../middleware/index');

router.get('/', indexPage);

router.get('/signup', getSignup);

router.get('/auth/facebook', asyncErrorHandler(facebookLogin));

router.get('/auth/facebook/callback', asyncErrorHandler(facebookCallback));

router.get('/auth/google', asyncErrorHandler(googleLogin));

router.get('/auth/google/callback', asyncErrorHandler(googleCallback));


router.post('/signup', [
    check('username').not().isEmpty().withMessage('Username is required!'),
    check('email').not().isEmpty().withMessage('Email is required!'),
    check('email').isEmail().withMessage('Email is invalid!'),
    check('password').not().isEmpty().withMessage('Password is required!'),
    check('password').isLength({min: 5}).withMessage('Password should be atleast 5 characters!')
], authValidation, postSignup);

router.post('/', [
    check('username').not().isEmpty().withMessage('Username is required!'),
    check('password').not().isEmpty().withMessage('Password is required!')
], authValidation, asyncErrorHandler(postIndexPage));

router.get('/logout', getLogout);

module.exports = router;
