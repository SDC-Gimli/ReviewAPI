CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INT,
  rating INT,
  date BIGINT,
  summary varchar(255),
  body text,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name varchar(60),
  reviewer_email varchar(60),
  response varchar(255),
  helpfulness INT
);

CREATE TABLE IF NOT EXISTS reviewPhoto (
  id SERIAL PRIMARY KEY,
  review_id INT NOT NULL REFERENCES reviews(id),
  url varchar(255)
);

CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id INT,
  name varchar(25)
);

CREATE TABLE IF NOT EXISTS characteristicsReviews (
  id SERIAL PRIMARY KEY,
  characteristics_id INT NOT NULL REFERENCES characteristics(id),
  review_id INT NOT NULL REFERENCES reviews(id),
  value INT
);