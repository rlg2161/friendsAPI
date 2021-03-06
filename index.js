const express = require('express')
const app = express()
const port = 3000

var users_routers = require('./routes/users');

app.use(express.json())
app.use('/', users_routers);

app.listen(port, () => console.log(`Friends API Listening on port ${port}`))
