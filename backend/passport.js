var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
var User     = require('./user');
var FacebookUser = require('./facebookUser');
var FacebookConfig = require('./fb');


passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        User.password_authenticate(email, password).then(user => {
            return done(null, user);
        }).catch(() => {
            return done(null, false, {message: 'Bad credentials'});
        });
    }
));

passport.use(new FacebookTokenStrategy({
        clientID        : FacebookConfig.appID,
        clientSecret    : FacebookConfig.appSecret,
        callbackURL     : FacebookConfig.callbackUrl
    },
    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // find the user in the database based on their facebook id
            FacebookUser.where({ 'facebook_id' : profile.id }).fetch().then(facebookUser => {
                // if the user is found, then log them in
                if (facebookUser) {
                    User.where({'facebookUser_id': facebookUser.get('id')}).fetch().then(user => {
                        return done(null, user); // user found, return that user
                    });
                } else {
                    // if there is no user found with that facebook id, create them

                    var attrs = {
                        access_token: access_token,
                        facebook_id: profile.id,
                        first_name: profile.name.givenName,
                        last_name: profile.name.familyName,
                        email: profile.emails[0].value,
                    }

                    FacebookUser.create(attrs).then(user => {
                        return done(null, user);
                    });
                }
            });
        });
    }
));

// setup the strategy using defaults  
passport.use(new SlackStrategy({
    clientID: SlackConfig.CLIENT_ID,
    clientSecret: SlackConfig.CLIENT_SECRET
  }, (accessToken, refreshToken, profile, done) => {

    // asynchronous
    process.nextTick(() => {
        SlackUser.where({ 'slack_id' : profile.user.id }).fetch().then(slackUser => {
            if (slackUser) {
                User.where({'slackUser_id' : slackUser.get('id')}).fetch().then(user => {
                    return done(null, user); //user found, return that user
                });
            } else {
                var attrs = {
                    access_token: accessToken,
                    slack_id: profile.user.id,
                    name: profile.user.name,
                    email: profile.user.email,
                    team_id: profile.team.id,
                    team_name: profile.team.name,
                }

                SlackUser.create(attrs).then(user => {
                    return done(null, user);
                });
            }
        })
    })
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    new User({id: id}).fetch({require: true}).then(user => {
        done(null, user);
    }).catch(err => {
        done(err, null);
    });
});

module.exports = passport;