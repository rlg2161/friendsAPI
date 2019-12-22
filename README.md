## Instructions

Requirements:
  - Node v12.13.1 (latest language version release with NPM support when project was started)
  - Python3 (for data generation)
  - Docker (api/scripts assuming Docker for Mac networking (aka postgres accessible over localhost))

    -- If docker is not installed, app will work with a locally running instance of postgres. However,
      startup scripts assume Postgres is running in docker
  - Docker-Compose v3

Startup:
  - To download the relevant node packages for the api:

    `npm install`
  - To stand up and initialize the database:

    `./bin/init_postgres.sh`
  - To run the api:

    `npm run api`
  - To generate and insert the data (in a new terminal window):

    `./bin/insert_data.sh`

Scripts contain relative paths, so all scripts should be run from the main directory of the app.

## Application Design

For this project I sought to keep my application as simple and tight as possible. It uses express as
a lightweight api layer and connects to postgres using the `pg` package.

This application relies on 2 main postgres tables; `users` and `friends`. Users is the main users table
which stores `user_id`, `first_name` and `last_name`. There is the accompanying `users_user_id_seq` table that tracks the monotonically increasing user keys. Using this key structure allows you to easily build pagination into your postgres queries (instead of doing them in memory in the application). In
the long term, this would have significant performance improvements, especially as the users collection
grows beyond the toy data set provided here.

The `friends` table is a simple relation between user_id's. It stores the `id` of the friendship, the
id of the respective user in the `user_id` column and the user_id of their friend in the `friend_id`
column. Accordingly, the record (N, 1, 5) means `user_id:1 is friends with user_id:5`. The primary key  
of each record in this table is a sequence; the relation is stored in `friends_id_seq`. As with the
users table, this id structure simplifies pagination (not implemented here as not in
requirements).

I chose to model the friend relationship  along the common "following" pattern in most social apps
today - this means you can friend someone but they do not have to friend you back (aka the friend
relation is uni-directional). I chose to model it this way as it was slightly simpler to implement.
To implement a bi-directional friendship model I would keep the table structures the same and insert
2 relations for each friendship created (i.e. if user 1 friends user 2, I would insert (id: N,
user_id:1, friend_id:2) && (id:N+1, user_id:2, friend_id:1)).

### Routing

As all potential requests relate to the user (create/get user, create/get user friendships,
get friends of a user's friends), I put all routes in the same `/user(s)` tree. Following REST
conventions, GET's retrieve resources and POST's create resources. Given further time, I would have
also implemented a DELETE endpoint to delete records and a PUT endpoint to update records (although
in practice I often find it easier to just recreate the whole record rather than modifying an
existing record). The route tree is as follows:

```
POST /user --> create a user
  --> expected payload `{"first_name": <string>, "last_name": <string>}`
GET /user/:id --> get user by id
GET /users --> get all user id's
GET /users/:page? --> get a page of user_ids (default page size 10)
  --> if no page is provided, the whole payload will be returned. This is not really sustainable
      for a full application (where the user list is likely to be quite large) - in that case I
      would change the default behavior where no page is passed in to return only the first page of
      results

POST /user/:id/friend --> create a friendship relation
--> expected payload `{"user_id": <int>, "friend_id": <int>}
GET /user/:id/friends --> get friends of a given user

GET /user/:id/fof --> get friends of friends of a given user
```

### Migrations

To handle migrations, I would use https://github.com/salsita/node-pg-migrate. This is a popular npm
package that is 1) written in javascript 2) postgres specific. These two features are valuable in that
they allow you to include your database migration code in your main codebase and they allow you to
utilize the full set of postgres features (instead of only enabling you to use the common set of
features across most/all relational db's).

In depth documentation can be found at the above repo. I have included a very simple sample migration
to add a `birthday` column to the users field.

### Generating Data:

In order to ensure that I was coding correct behavior into this API, I wanted to create a non-trivial
dataset to test with. Although it is simple to generate a few records by hand and insert, it is
difficult to ensure that your app is working correctly with a very limited set of sample data. As such,
I created some scripts to generate users and friendship links. I wrote these scripts in python as I
find it to be the easiest tool to use to read in files and perform simple manipulations on the data.

These scripts operate on two lists of names I found. The first is the most common boy and girl names
in 2019 and the second are the top 1000 most common last names in English speaking countries. My
python script is super simple; it parses the name data into dictionaries, one for first names and one
for last names. It then randomly grabs a first and last name and writes it to file.

The friendship links are even easier - it simply generates between 1 and 10 friend relations between
user id's and writes them to file.

This data is programmatically inserted into the database via the `insert_users.sh` and
`insert_friendships.sh` scripts - they simply wrap calls to the API to create the relevant resources.
I opted to use bash in this instance as it was simplest to ensure serial API calls so as to not swamp
my API (this happened when I first implemented in node - everything was being run in parallel, creating
too many requests for my API to handle. Reimplementing in bash was ultimately simpler than
constructing a framework to set a maximum number of requests in flight at a time). The script
`insert_data.sh` wraps the whole data generation and insertion process.

### Testing the API

To test the API, I used a combination of `curl` and `jq`. For example, to get a user:

`curl http://localhost:3000/user/<id>` or `curl http://localhost:3000/user/<id> | jq .`

To post a user:

`curl -XPOST -H "Content-Type: application/json" -d '{"first_name": "Ross", "last_name": "Gruber"}' localhost:3000/user`

To post a user from file:

`curl -XPOST -H "Content-Type: application/json" -d@/path/to/file localhost:3000/user`

`jq` is useful in parsing outputs from the API (for example to ensure that pagination requests are
returning correct results).

I have also used Postman for API testing in the past. However, I am simply more comfortable on the
command line and prefer to use CLI tools.

## Future Improvements

### Hardening API

Like all real world applications, this friends API would eventually run into some bad requests that
it was not equipped to handle. Although the API *should* not fall over when it receives bad data,
it may not handle it particularly gracefully. For a production API, I would invest some time in
hardening the API to ensure correct behavior when it receives inputs it is not expecting. This
includes verbose error messaging to help clients understand what their errors are.

### Prevention of duplicates

Because this app is very bare-bones, it does not have any functionality to handle duplicates; they
will simply be indexed in the db with a new id. Ideally, a given user would not be able to exist
multiple times in the same table and a given friendship should not be stored multiple times. I would
achieve this by adding uniqueness properties to the table to ensure that a given user (aka first_name +
last_name) or friendship is only represented one time. (NB: In the real world this would be more
complicated as human names are themselves not unique - so you would want a more complicated pattern
than the above).

### Testing

Testing is crucial for any production application - I would not consider a project "production-ready"
until there is sufficient test coverage over critical parts of the code. (NB: We often have to
deploy code that is not quite production ready in a startup environment; but the goal is for everything
to be tested before it goes into prod.)

I would use the `chai` testing framework (https://www.chaijs.com/) for unit tests. Integration tests
may or may not utilize `chai` or some higher level tooling depending on the usecase. For example, we
might use `chai` to ensure that our api code is returning correctly transformed data from the
database. However, we might use a combination of higher order tools to spin up the API and Database,
insert various things into the database and then test the outputs of various API calls to ensure that
our data was indexed correctly on the way in and transformed correctly on the way out.

When testing, it is important to test key interfaces in the code that _*are not*_ handled by the
language or lower level packages in your code. In other words, there is no need to `assert(2+2==4)` --
this is built into the language at a very low level and we can assume that it works. That principle
should be carried all the way up the stack to your code. In other words, we should not be testing
`pg` functionality in our `FriendsAPI` tests - we should assume that postgres interfaces are working
correctly. Although this can often seem counter-intuitive, this is an important principle that allows
us to keep our test suites DRY and encapsulated to code that we can control and break/fix.

#### Unit tests

Unit tests are supposed to test a particular function to ensure that it behaves correctly (and
deterministically). The are not supposed to hit any outside resources - those that are required can
be mocked. This helps to ensure that unit tests run quickly and that your test suite will not fail
due to an issue out of your control (ex: test database is down).

For this particular application, I do not believe there is all that much to unit test as is.
Baseline postgres functionality is well documented and maintained in the official postgres package
`pg` -- it would not be beneficial for us to write our own tests wrapping the connection pool
to ensure that it works for example.

Additionally, one might be inclined to test the api to ensure that API payloads are received correctly.
However, this functionality is baked into `express`, one of the most popular projects in the node
ecosystem. We should leave testing of these capabilities to the express package.

Consequently, the main functionality we have added to this app is the pagination on the users endpoint.
I have extracted this behavior into the `composeSelectUsersQuery` function for both code cleanliness
and ease of testing. I would write tests for this function to ensure that 1) pagination works correctly
(page 1 == results 1-10 and page 2 == results 11-20) and 2) that special cases are handled correctly
(i.e. how do we handle page 0? what if there is no page? what if we page past the total results?)

You could also mock the various insertions and retrievals from postgres - however; I feel that this
is better suited for an integration test. We already know the postgres interface works (based on the
principles outlined above); mocking that interface and testing it will not give us any new information
or help us detect any breakage.


#### Integration tests

Although much of this app's behavior is not really suitable for unit tests at this level of complexity,
integration tests would be useful to ensure that all application components are linking together
correctly. This allows us to ensure that our application code and our database schema are in sync or
that we will receive deterministic outputs for a given input. I generally prefer this approach to
mocking interfaces in unit tests. In my experience, it is very easy to write unit tests that are
tightly coupled to that mock; unless you are careful, those tests will continue to pass even as the
db schema and/or input data have changed. By removing the mock and actually testing the integration
between the two components, you are much more easily able to detect breakage between the two components
and prevent issues from being deployed to production.

In this case, an integration test might include:
1) standing up the app && the db
2) indexing 5 users and 10 friendships (out of a possible 20)
3) ensuring that the 5 friend lists are correct
4) ensuring that one friend-of-friend list is correct

This test would take quite a bit longer to run than the unit test (though it would still be quick in
human time), but it gives you confidence that all the interface layers of your app
(http <-> api; api <-> db) are working correctly.

### Dockerfile

Given more time, I would package this application up in a Dockerfile (as well as include tooling
for the docker toolchain using `make`). This would simplify the application orchestration and allow
you to launch both postgres and the application via docker-compose for example.

### Config and Logging

For a production level app, I would also want to add config files and handling as well as an actual
logger (as opposed to just writing to stdout).

## Notes

I have not written production node code for a while, so please forgive the style and syntax errors :)
