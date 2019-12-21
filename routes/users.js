var express = require('express');
var router = express.Router();

var pool = require('../db').pool

const PAGE_SIZE = 10

// Users
//create user
router.post('/user', (req, res) => {
  var user = req.body
  pool.query('INSERT INTO users (user_id,first_name,last_name) \
    values (nextval(\'users_user_id_seq\'), \
    $1, $2);', [user.first_name, user.last_name],
   (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({"error": "Failed to insert record: " + error.message})
    } else {
      res.status(200).json({"msg": "successfully inserted user: " + user.first_name + " " + user.last_name})
    }
  })
})

// fetch users
router.get('/users/:page?', (req, res) => {
  const pageNum = Number(req.params.page)
  pool.query(composeSelectUsersQuery(pageNum, PAGE_SIZE), [], (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({"error": "Failed to retrieve users: " + error.message})
    }
    res.status(200).json(results.rows)
  })
})

// fetch single user
router.get('/user/:id', (req, res) => {
  const userId = Number(req.params.id)
  pool.query('SELECT * FROM users WHERE user_id = $1;', [userId], (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({"error": `Failed to retrieve user ${userId}: ` + error.message})
    }
    if (results.rows.length == 1) {
      res.status(200).json(results.rows[0])
    } else {
      res.status(200).json({})
    }
  })
});

// create friendship
// Friends
//create friend
router.post('/user/:id/friend', (req, res) => {
  const friendship = req.body
  pool.query('INSERT INTO friends \
    (id,user_id,friend_id)\
    values (nextval(\'friends_id_seq\'), $1, $2);',
    [Number(friendship.user_id), Number(friendship.friend_id)],
   (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({"error": "Failed to insert record: " + error.message})
    } else {
      res.status(200).json({"msg": "successfully inserted friendship"})
    }
  })
})

// fetch friends of a single user
router.get('/user/:id/friends', (req, res) => {
  const userId = Number(req.params.id)
  pool.query('SELECT users.first_name, users.last_name\
    FROM users\
    INNER JOIN friends on users.user_id = friends.friend_id\
    WHERE friends.user_id=$1;', [userId], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

// fetch friends of friends of a single user
router.get('/user/:id/fof', (req, res) => {
  const userId = Number(req.params.id)
  pool.query('WITH user_friends\
    AS(\
      SELECT friend_id\
      FROM friends\
      WHERE friends.user_id = $1\
    )\
    SELECT users.first_name, users.last_name\
      FROM users\
      INNER JOIN friends on users.user_id = friends.friend_id\
    WHERE friends.user_id\
      IN(\
        SELECT friend_id\
        FROM user_friends\
      );', [userId], (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({"error": `Failed to retrieve friends of friends \
        for ${userId}: ` + error.message})
    }
    res.status(200).json(results.rows)
  })
})

function composeSelectUsersQuery(page, page_size) {
  var queryString = "SELECT * FROM users"
  const queryTerminator = ";"
  if (isNaN(page) == false && page != 0) {// If you query for page 0; you get the full set back
    const start = (page-1) * page_size +1
    const end = page*page_size
    const paginator = ` WHERE user_id BETWEEN ${start} AND ${end}`
    queryString = queryString + paginator
  }
  return queryString + queryTerminator
}

module.exports = router;
