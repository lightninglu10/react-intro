// This file defines the server setup that applies to dev, test and prod envs
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
// const passport = require('./server/passport');

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/health', function(req, res, next) {
    res.status(200).json({success: 'pong!'});
});

module.exports = app;