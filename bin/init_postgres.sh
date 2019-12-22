#!/bin/bash
PGPASSWORD=secret
USER=upkeep
DB=friendsAPI
HOSTNAME=localhost

docker-compose up -d
printf 'Sleeping 15 secs for postgres to spin up \n'
sleep 15
printf 'Creating database \n'
PGPASSWORD=$PGPASSWORD createdb -h $HOSTNAME -U $USER -w $DB
PGPASSWORD=$PGPASSWORD psql -h $HOSTNAME -U $USER -f ./bin/create_table.sql $DB
