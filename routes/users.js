var express = require('express');
var router = express.Router();

var pool = require('../db').pool

const PAGE_SIZE = 2

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
router.get('/users/:page?', (req, res) => {
  const pageNum = Number(req.params.page)
  pool.query('SELECT * FROM users;', [], (error, results) => {
    // ultimately, if this query gets too slow, you could add the pagination
    // to the query itself (serial, monotonically increasing keys lets you do
    // this). However, overkill for now
    if (error) {
      throw error
    }
    var retval = results.rows
    if (isNaN(pageNum) == false) {
      if (results.rows.length > PAGE_SIZE) {
        startIndex = (PAGE_SIZE*(pageNum - 1))
        retval = retval.slice(startIndex, startIndex+PAGE_SIZE)
      }
    }

    res.status(200).json(retval)
  })
})

// fetch single user
router.get('/user/:id', (req, res) => {
  console.log(pool)
  const userId = Number(req.params.id)
  console.log("userId: " + userId + " sent")
  pool.query('SELECT * FROM users WHERE user_id = $1;', [userId], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

// create friendship
// Friends
//create friend
router.post('/user/:id/friend', (req, res) => {
  friendship = req.body
  console.log("Friendship: " + friendship.id + " " + friendship.user_id + " " + friendship.friend_id)
  pool.query('INSERT INTO friends (id,user_id,friend_id) values ($1, $2, $3);', [friendship.id, Number(friendship.user_id), Number(friendship.friend_id)],
   (error, results) => {
    if (error) {
      if (error.message.includes("duplicate key")) {
        res.status(400).json({"msg": "overwriting of record rejected"})
      }
    } else {
      res.status(200).json({"msg": "successfully inserted friend"})
    }
  })
})

// fetch friends of a single user
router.get('/user/:id/friends', (req, res) => {
  console.log(pool)
  const userId = Number(req.params.id)
  console.log("Friend_id: " + userId + " sent")
  pool.query('SELECT friends.user_id, users.first_name, users.last_name\
    FROM users\
    INNER JOIN friends on users.user_id = friends.friend_id\
    WHERE friends.user_id=$1;', [userId], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

// // delete user
// app.delete('/user/{userId}')
module.exports = router;
