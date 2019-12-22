#!/bin/bash
python3 ./bin/generate_data.py
./bin/insert_users.sh
./bin/insert_friendships.sh
