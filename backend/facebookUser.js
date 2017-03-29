var bookshelf = require('./bookshelf');
var User = require('./user');
var Chance = require('chance');
var chance = new Chance();
var _ = require('lodash');

module.exports = bookshelf.Model.extend({
    tableName: 'facebookUser',

    user: function() {
        return this.belongsTo(User);
    },

    serializeForSelf: function() {
        return _.pick(this.attributes, ['id',
                                        'first_name',
                                        'last_name',
                                        'facebook_id',
                                        'access_token',
                                        'email',]);
    },

    // Add instance methods here.

}, {
    // Class methods here.
    create: function(attrs) {
        // return new this({user_id: xxx, customer_id: yyy}).save()
        var facebookUser = new this(attrs);
        var newUser = facebookUser.save().then(user => {
            return new User({
                default_nickname: attrs.first_name.toLowerCase() + '.' + attrs.last_name.toLowerCase(),
                email: attrs.email,
                facebookUser_id: user.get('id'),
                chat_id: chance.md5()
            });
        }).then(newUser => {
            return newUser.save();
        })

        return newUser;
    }
});
