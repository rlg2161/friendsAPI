Notes:

Using Node v12.13.1 --> latest language version release with NPM support.

Dependencies:
Using NPM because that is what I am familiar with. For a long term production project, I would want to look at using other dependency management tools, particularly yarn.

API Design:

Using a basic Express API for simplicity. I generally prefer to use more bare-bones frameworks for my API's and Express fits the bill.


Generating Data:

Scripts are written in Python as I find that is the easiest tool chain to easily manipulate text. To generate the user data I did the following:

1) Download list of most popular boys and girls baby names in 2019. This file is saved as `./data/raw/names.txt` The format of that file is:
```
N <boy_name>  <girl_name>
N+1 <boy_name>  <girl_name>
```
2) Write a script called

I have written a script to generate a data set for friends. This script is housed in `./bin/generate_data.py`. `./bin/seedFriends` will use the `POST` methods on the API to generate the initial load of data into Postgres.
