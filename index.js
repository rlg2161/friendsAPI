const express = require('express')
const app = express()
const port = 3000

const pg = require('pg');

const client = new pg.Client({
  user: 'upkeep',
  host: 'localhost',
  database: 'friendsAPI',
  password: 'secret',
  port: 5432,
});
client.connect();

console.log(client)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/', (req, res) => res.send('Hello World!'))

// Routes

// Users
// fetch users
app.get('/users', (req, res) => {
  res.send('You should get a list of users back eventually')
})
// // fetch single user
// app.get('/user/{userId}')
// // create user
// app.post('/user')
// // delete user
// app.delete('/user/{userId}')



// Friends
// fetch friends of users


// fetch friends of friends
