require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const logger = require('morgan');
const socketIO = require('socket.io');
const User = require('./models/user');


const indexRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const homeRouter = require('./routes/home');
const groupRouter = require('./routes/group');
const filterRouter = require('./routes/filterResults');
const privateRouter = require('./routes/private');
const newsRouter = require('./routes/news');

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

require('./socket/groupChat')(io);
require('./socket/sendRequest')(io);
require('./socket/global')(io);
require('./socket/privateChat')(io);

server.listen(4000, () => {
    console.log('Listining on PORT 3000...');
});


//connect to database
mongoose.connect('mongodb://localhost:27017/WWE_Club', {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SECRET,
	resave: true,
	saveUninitialized: true
}));

app.use(flash());

const facebookRouter = require('./passport/passport-facebook');
const googleRouter = require('./passport/passport-google');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set local variable middleware
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use(indexRouter);
app.use(adminRouter);
app.use(homeRouter);
app.use(groupRouter);
app.use(filterRouter);
app.use(privateRouter);
app.use(newsRouter);

module.exports = app;
