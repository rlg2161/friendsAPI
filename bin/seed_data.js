const pg = require('pg');
const connectionString = 'postgres://upkeep:secret@postgres:5432/friendsAPI';

const client = new pg.Client(connectionString);
client.connect();

console.log(client)
