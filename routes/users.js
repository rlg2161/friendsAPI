var express = require('express');
var router = express.Router();

var pool = require('../db').pool

console.log(pool)
// Users
// fetch users
router.get('/users', (req, res) => {
  res.send('You should get a list of users back eventually')
})

// fetch single user
router.get('/user/:id', (req, res) => {
  console.log(pool)
  const userId = Number(req.params.id)
  console.log("User_id: " + userId + " sent")
  pool.query('SELECT * FROM users WHERE id = $1', [userId], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

router.post('/user', (req, res) => {
  user = req.body

  pool.query('INSERT INTO users VALUES ($1, $2, $3)', [user.user_id], [user.first_name], [user.last_name],
   (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
  res.send("got it")
})

// router.get(`/users/:id`), (req, res) => {
//
//   const userId = Number(req.params.id)
//   console.log("User_id: " + userId + " sent")
//   res.send("User_id: " + userId + " sent")
//   // client.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
//   //   if (error) {
//   //     throw error
//   //   }
//   //   response.status(200).json(results.rows)
//   // })
// }

// // create user
// app.post('/user')
// // delete user
// app.delete('/user/{userId}')
module.exports = router;
