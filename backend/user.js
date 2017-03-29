var bookshelf = require('./bookshelf');
var bcrypt = require('bcrypt');
var Chance = require('chance');
var chance = new Chance();
var env = require('./env');
var Promise = require('bluebird');
var _ = require('lodash');

function hashPassword(password) {
    return new Promise(function(resolve, reject){
        var workFactor = env === 'test' ? 1 : 12;
        bcrypt.genSalt(workFactor, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                resolve(hash);
            });
        });
    });
}

function compareHash(password, hash) {
    return new Promise(function(resolve, reject){
        bcrypt.compare(password, hash, function(err, res) {
            if(res) {
                resolve(true);
            } else {
                reject(new Error("bcrypt compare rejected"));
            }
        });
    });
}

module.exports = bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true,

    serializeForSelf: function() {
        return _.pick(this.attributes, ['id',
                                        'username',
                                        'email',
                                        'created_at',,]);
    },

    update: function(attrs) {
        _.each(['default_nickname', 'email'], key => {
            if(attrs.hasOwnProperty(key)) {
                this.set(key, attrs[key]);
            }
        });

        if(attrs.hasOwnProperty('password')) {
            console.log("attrs.hasOwnProperty: " + attrs.password)
            this.newPassword = attrs.password;
        }

        return this.validate().then(this.save.bind(this));
    },

    // as a side-effect this also bcrypts pw
    validate: function() {
        return new Promise((resolve, reject) => {
            var required_attrs = ['email'];
            _.each(required_attrs, attr => {
                if(!this.get(attr)) {
                    reject(new Error(attr + ' is required'));
                    return
                }
            });

            if(this.hasOwnProperty('newPassword') || !this.get('hashed_password')) {
                if(!this.newPassword) {
                    reject(new Error('password is required'));
                    return
                } else if(this.newPassword.length < 6) {
                    reject(new Error('password must be at least 6 chars'));
                    return
                }
            }

            resolve();
        }).then(() => {
            
        }).then(() => {
            if(this.hasOwnProperty('newPassword')) {
                var newPassword = this.newPassword;
                delete this.newPassword;
                return hashPassword(newPassword);
            }
        }).then(hashedPassword => {
            if(hashedPassword) {
                this.set('hashed_password', hashedPassword);
            }
        });
    }

}, {
    create: function(attrs) {
        var user = new this(_.pick(attrs, ['default_nickname', 'email']));

        user.newPassword = attrs.password;

        return user.validate().then(user.save.bind(user));
    },

    authenticate: function(access_token) {
        return new this({access_token: access_token}).fetch({required: true});
    },

    password_authenticate: function(email, password) {
        return new this({email: email}).fetch({require: true}).then(user => {
            return Promise.all([user, compareHash(password, user.get('hashed_password'))])
        }).then((results) => {
            return results[0];
        });
    }
});
