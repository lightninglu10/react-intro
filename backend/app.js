var express = require('express');
var router = express.Router();

// var db       = require('./db');
// var passport = require('./passport');

router.get('/login', function(req, res, next) {
    // Todo: make an actual login system. For now, always returning false.
    return res.status(200).json({loggedIn: false, username: null})
});