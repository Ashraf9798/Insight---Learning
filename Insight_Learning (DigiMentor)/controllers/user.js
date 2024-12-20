const passport = require('passport');
const { validationResult } = require('express-validator');
const User = require('../models/user');

module.exports = {
    indexPage(req, res) {
        res.render('index');
    },

    getSignup(req, res) {
        res.render('signup');
    },

    authValidation(req, res, next) {
        const err = validationResult(req);
        // console.log(err);
        const errors = err.array();
        const messages = [];
        errors.forEach((e) => {
            messages.push(e.msg);
        });
        if(messages.length > 0) {
            req.flash('error', messages);
            if(req.url === '/signup') {
                return res.redirect('/signup');
            }
            else if(req.url === '/') {
                return res.redirect('/');
            }
        }
        return next();
    },

    async postSignup(req, res, next) { 
        try {
            const { username, email, password } = req.body;
            const user = new User({username, email});
            const registeredUser = await User.register(user, password);
            res.redirect('/home');
        } catch(err) {
            let error = err.message;
            // if (error.includes('duplicate') || error.includes('index: username_1 dup key')) {
            //     req.flash('error', 'A user with the given username is already registered !');
            //     return res.redirect('/signup');
            // }
            if (error.includes('duplicate') || error.includes('index: email_1 dup key')) {
                req.flash('error', 'A user with the given email is already registered !');
                return res.redirect('/signup');
            }
            req.flash('error', err.message);
            res.redirect('/signup');
        }
    },

    async postIndexPage(req, res, next) {
        const { username, password } = req.body;
        const { user } = await User.authenticate()(username, password);
        if(!user) {
            req.flash('error', 'Invalid username or password !'); 
            return res.redirect('/'); 
        }
        req.logIn(user, function(err) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/');
            };
            res.redirect('/home');
        });
    },

    getLogout(req, res, next) {
        req.logout();
        req.flash('success', 'Logged out successfully!');
        res.redirect('/');
    },

    async facebookLogin(req, res, next) {
        await passport.authenticate('facebook', {
            scope: 'email'
        })(req, res, next);
        return; 
    }, 

    async facebookCallback(req, res, next){
        await passport.authenticate('facebook', { 
            successRedirect: '/home',
            failureRedirect: '/signup', 
            failureFlash: true 
        })(req, res, next); 
    },

    async googleLogin(req, res, next) {
        await passport.authenticate('google', {
            // scope: [
            //     'https://www.googleapis.com/auth/plus.login',
            //     'https://www.googleapis.com/auth/plus.profile.emails.read'
            // ]
            scope: ['profile', 'email']
        })(req, res, next);
        return;
    },

    async googleCallback(req, res, next){
        await passport.authenticate('google', { 
            successRedirect: '/home',
            failureRedirect: '/signup', 
            failureFlash: true 
        })(req, res, next); 
    }
}
