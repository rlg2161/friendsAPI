var express = require('express');
var router = express.Router();

var pool = require('../db').pool

console.log(pool)
// Users

//create user
router.post('/user', (req, res) => {
  user = req.body
  console.log(user.user_id + " " + user.first_name + " " + user.last_name)
  pool.query('INSERT INTO users (user_id,first_name,last_name) values ($1, $2, $3);', [Number(user.user_id), user.first_name, user.last_name],
   (error, results) => {
    if (error) {
      if (error.message.includes("duplicate key")) {
        res.status(400).json({"msg": "overwriting of record rejected"})
      }
    } else {
      res.status(200).json({"msg": "successfully inserted user"})
    }
  })
})

// fetch users
router.get('/users', (req, res) => {
  pool.query('SELECT * FROM users;', [], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

// fetch single user
router.get('/user/:id', (req, res) => {
  console.log(pool)
  const userId = Number(req.params.id)
  console.log("User_id: " + userId + " sent")
  pool.query('SELECT * FROM users WHERE user_id = $1;', [userId], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

// // delete user
// app.delete('/user/{userId}')
module.exports = router;
