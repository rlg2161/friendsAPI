const express = require('express')
const app = express()
const port = 3000

var users_routers = require('./routes/users');
var friends_routers = require('./routes/friends');

app.use('/', users_routers);
// app.use('/', friends_routers);


// Friends
// fetch friends of users


// fetch friends of friends
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
