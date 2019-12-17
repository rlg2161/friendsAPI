var express = require('express');
var router = express.Router();

var client = require('../db')

// Users
// fetch users
router.get('/users', (req, res) => {
  res.send('You should get a list of users back eventually')
})

router.get('/users/0', (req, res) => {
  res.send("this is a test")
})
// // fetch single user

router.get('/users/:id', (req, res) => {
  const userId = Number(req.params.id)
  console.log("User_id: " + userId + " sent")
  client.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

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
