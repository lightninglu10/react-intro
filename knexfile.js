var env = require('./backend/env');
var connection;
if(process.env.RDS_HOSTNAME) {
  // Don't worry about this for now, only relevant if you want to deploy
    connection = { host     : process.env.RDS_HOSTNAME,
                   database : 'ebdb',
                   user     : process.env.RDS_USERNAME,
                   password : process.env.RDS_PASSWORD,
                   port     : process.env.RDS_PORT };
} else if (process.env.PG_CONNECTION_STRING) {
    connection = process.env.PG_CONNECTION_STRING;
} else if (env == 'test') {
    connection = { database : 'react_test' };
} else {
    connection = { database : 'react_intro' };
}

module.exports = {
    client: 'pg',
    connection: connection,
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'backend/migrations'
    }
};
