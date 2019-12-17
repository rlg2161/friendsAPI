const pg = require('pg');

const client = new pg.Client({
  user: 'upkeep',
  host: 'localhost',
  database: 'friendsAPI',
  password: 'secret',
  port: 5432,
});
client.connect();

module.exports = {
  client //initialized postgres client
}
