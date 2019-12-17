# use generate_data.py to generate a list of names to be randomly combined for test data

import json
import sys
import random
import uuid
from datetime import datetime

first_name_list = []
last_name_list = []

with open('./data/raw/baby_name_list.tsv', 'r') as f:
    for line in f:
        split_line = line.split("\t")
        first_name_list.append(split_line[1].strip('\n').lower())
        first_name_list.append(split_line[2].strip('\n').lower())

with open('./data/raw/last_name_list.tsv', 'r') as f:
    for line in f:
        split_line = line.split("\t")
        last_name_list.append(split_line[0].lower())

random.seed(datetime.now())

users_list = []

for i in range(500):
    user = {}
    user['user_id'] = i + 1 # this gets us user_id's of 1-500 (instead of 0-499)
    user['first_name'] = first_name_list[random.randint(0, len(first_name_list) - 1)]
    user['last_name'] = last_name_list[random.randint(0, len(last_name_list) - 1)]

    users_list.append(user)


friends_list = []
for user in users_list:
    # arbitrarily a user can have up to 100 friends and everyone has at least one
    for i in range(random.randint(1, 100)):
        friendship = {}
        friendship["id"] = str(uuid.uuid4())
        friendship["user_id"] = user['user_id']
        friendship["friend_id"] = random.randint(1, 500) # user_id's are one indexed so we have to offset by one

        friends_list.append(friendship)

users_file = open('./data/users_list.json', 'w')
for user in users_list:
    users_file.write(json.dumps(user) + '\n')
users_file.close()

friends_file = open('./data/friends_list.json', 'w')
for friend in friends_list:
    friends_file.write(json.dumps(friend) + '\n')
friends_file.close()
