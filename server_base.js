// This file defines the server setup that applies to dev, test and prod envs
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const passport = require('./backend/passportConfig');

app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({secret: 'react_intro',
                 resave: false,
                 saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/health', function(req, res, next) {
    res.status(200).json({success: 'pong!'});
});

app.use('/api', function(req, res, next) {
    require('./backend/app')(req, res, next);
});

// app.use('/api/login', function(req, res, next) {
//     return res.status(200).json({loggedIn: false, username: null});
// });

module.exports = app;
