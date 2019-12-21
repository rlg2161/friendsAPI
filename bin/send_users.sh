#!/bin/bash
function sendUsers () {
  input="./data/users_list.json"
  while IFS= read -r line
  do
    echo "$line" |  curl -XPOST -d@- -H "Content-Type: application/json" localhost:3000/user
    echo ""
  done < "$input"
}

trap sendUsers EXIT
