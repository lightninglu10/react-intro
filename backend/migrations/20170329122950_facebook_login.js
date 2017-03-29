
exports.up = function(knex, Promise) {
    return knex.schema.createTable('facebookUser', function(table) {
        table.increments();
        table.string('first_name');
        table.string('last_name');
        table.string('facebook_id');
        table.string('access_token');
        table.string('email');
    }).table('users', function(table) {
        table.integer('facebookUser_id');
        table.unique('facebookUser_id');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('facebookUser')
        .table('users', function(table) {
            table.dropColumn('facebookUser_id');
        });
};