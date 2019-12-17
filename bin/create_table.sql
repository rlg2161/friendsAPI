CREATE TABLE users (
	user_id serial PRIMARY KEY,
	first_name varchar (50) NOT NULL,
	last_name varchar (50) NOT NULL
	);

CREATE TABLE friends (
  id varchar (36) PRIMARY KEY,
  user_id int NOT NULL,
  friend_id int NOT NULL
  );
