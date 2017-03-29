var express = require('express');
var router = express.Router();
var secureCookies = false; // we only secure them for production so we can test without https
var env      = require('./env');

var passport = require('./passportConfig');
var User     = require('./user');

router.post('/signup', function(req, res) {
    // Signup for service
    console.log(req.body);
    User.create(req.body).then(user => {
        res.status(200).json(user.serializeForSelf());
    }).catch(err => {
        res.status(400).json({error: err.message});
    });
});

router.get('/login', function(req, res, next) {
    // Get the login status of the user
    if(!req.user) {
        return res.status(401).json({error: 'authentication required'});
    }

    console.log(req.user.serializeForSelf());
    return res.status(200).json(req.user.serializeForSelf());
});

router.post('/login', function(req, res, next) {
    // Post the information for the login 
    passport.authenticate('local', function(err, user, info) {
        if (err) { return res.status(400).json({error: 'oops: ' + err}); }
        if (!user) { return res.status(400).json({error: info.message}); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            console.log(user.serializeForSelf());
            return res.status(200).json(Object.assign({message: 'successful login'}, user.serializeForSelf()));
        });
    })(req, res, next)
});

router.post('/logout', function(req, res, next) {
    // Logout of app
    req.logout();
    res.status(200).json({message: 'successful logout'});
});

router.post('/login/facebook/token', function(req, res, next) {
    // Facebook login
    passport.authenticate('facebook-token', function(err, user, info) {
        if (err) { return res.status(400).json({error: 'oops: ' + err}); }
        if (!user) { return res.status(400).json({error: 'Facebook login failed'}); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.status(200).json({message: 'successful login'});
        });
    })(req, res, next)
});

router.use(function renderUnexpectedError (err, req, res, next) {
    res.status(500).json({error: 'Unexpected Error'});
    next(err);
});

module.exports = router;
