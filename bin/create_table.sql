CREATE TABLE users (
	user_id serial PRIMARY KEY,
	first_name varchar (64) NOT NULL,
	last_name varchar (64) NOT NULL
	);

CREATE TABLE friends (
  id serial PRIMARY KEY,
  user_id int NOT NULL,
  friend_id int NOT NULL
  );
