const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new facebookStrategy({
    clientID: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    profileFields: ['displayName', 'photos', 'email'],
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback: true
}, (req, token, refreshToken, profile, done) => {
    User.findOne({facebook: profile.id}, (err, user) => {
        if(err) {
            return done(err);
        }
        if(user) {
            return done(null, user);
        } else {
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName.toLowerCase().replace(/ /g, "_");
            newUser.email = profile._json.email;
            newUser.userImage = `https://graph.facebook.com/${profile.id}/picture?type=large`;
            newUser.fbToken.push({token: token});
            newUser.save((err) => {
                return done(null, user);
            });
        }
    });
}));
