CREATE TABLE IF NOT EXISTS reviews (
  review_id SERIAL PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS reviews_photos (
  id SERIAL PRIMARY KEY,
  review_id INT NOT NULL REFERENCES reviews(review_id),
  url varchar(255)
);

CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id INT,
  name varchar(25)
);

CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id SERIAL PRIMARY KEY,
  characteristics_id INT NOT NULL REFERENCES characteristics(id),
  review_id INT NOT NULL REFERENCES reviews(review_id),
  value INT
);

create index idx_review_id on reviews using hash (review_id);
create index idx_product_id on reviews using hash (product_id);
create index idx_product_id_bt on reviews using btree(product_id);
create index idx_photos_url on reviews_photos using hash (url);
create index idx_photos_review_id on reviews_photos using hash (review_id);
create index idx_photos_id on reviews_photos using hash (id);
create index idx_char_product_id on characteristics using hash (product_id);
create index idx_char_name on characteristics using hash (name);
create index idx_char_review_characteristic_id on characteristic_reviews using hash (characteristic_id);
create index idx_reviews_bodylength on reviews using btree (LENGTH(body));