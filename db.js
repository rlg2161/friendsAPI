
const { Pool } = require('pg')
// pools will use environment variables
// for connection information
const pool = new Pool({
  user: 'upkeep',
  host: 'localhost',
  database: 'friendsAPI',
  password: 'secret',
  port: 5432,
})

module.exports = {
  pool //initialized postgres client
}
