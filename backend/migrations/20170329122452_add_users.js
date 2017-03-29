
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
        table.increments();
        table.string('username');
        table.timestamps();
        table.string('email');
        table.unique('email');
        table.string('hashed_password');
        table.timestamp('last_seen_at');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
