#!/bin/bash

function sendFriendships () {
  input="./data/friends_list.json"
  while IFS= read -r line
  do
    userId=$(echo "$line" | jq '.user_id')
    url="localhost:3000/user/${userId}/friend"
    echo "$line" | curl -XPOST -d@- -H "Content-Type: application/json" ${url}
    echo ""
  done < "$input"
}

trap sendFriendships EXIT
