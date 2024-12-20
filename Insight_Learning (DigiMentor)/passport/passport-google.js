const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new googleStrategy({
    clientID: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    User.findOne({google: profile.id}, (err, user) => {
        if(err) {
            return done(err);
        }
        if(user) {
            return done(null, user);
        } else {
            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName.toLowerCase().replace(/ /g, "_");
            newUser.email = profile.emails[0].value;
            newUser.userImage = profile._json.picture;
            newUser.save((err) => {
                if(err) {
                    return done(err);
                }
                return done(null, newUser);
            });
        }
    });
}));
