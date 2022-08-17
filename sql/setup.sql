-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS yawp_users;
DROP TABLE IF EXISTS restaurants;

CREATE TABLE restaurants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR NOT NULL,
  cuisine VARCHAR,
  city VARCHAR NOT NULL
);

INSERT INTO restaurants (name, cuisine, city) VALUES
('El Gallo', 'Mexican', 'Portland, OR'),
('Green Elephant', 'Thai', 'Portland, ME'),
('Boxcar Coffee', 'Coffee', 'Boulder, CO'),
('Broder Cafe', 'Swedish', 'Portland, OR'),
('Benkay', 'Sushi', 'Portland, ME');

CREATE TABLE yawp_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT
);

INSERT INTO yawp_users (first_name, last_name, email, password_hash) VALUES
('Test', 'User', 'test@test.com', 'notapasswordhash'),
('Fake', 'Person', 'fake@fake.com', 'fakepasswordhash'),
('Dillon', 'B', 'db@email.com', '$2b$10$eqbM14Ykewm.4JXZg0rEm.YWgn8S7a4YOJcfq5KEpXTccCOfQGcly');

CREATE TABLE reviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  stars SMALLINT NOT NULL CONSTRAINT five_stars CHECK(stars >= 0 AND stars <= 5),
  detail TEXT,
  restaurant_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (user_id) REFERENCES yawp_users(id)
);

INSERT INTO reviews (stars, detail, restaurant_id, user_id) VALUES 
(5, 'Best burrito ever!!', 1, 1),
(3, 'My tacos were great, but my partner said their burrito was dry and pretty salty, and the beer was overpriced.', 1, 2),
(5, 'This is my go to spot for vegetarian Thai food', 2, 3),
(2, 'Just another pretentious coffee shop with all kinds of crazy gadgets taking the place of a spot that had been around for years.', 3, 1),
(5, 'Literally the best coffee I have had anywhere', 3, 3),
(1, 'The food was good but the staff was loudly talking smack about our table within earshot', 4, 1),
(4, 'It can be hard to find good sushi in Maine, and this place is not perfect but it is still probably the best sushi I have found', 5, 2);
