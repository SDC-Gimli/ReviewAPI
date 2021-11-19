const express = require('express');
const axios = require('axios');
const PORT = 3000;
const app = express();
const db = require('./database');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/reviews", (req, res) => {
  console.log(req.query.product_id);
  console.log(req.query);
  let page = req.query.page || 1;
  let count = req.query.count || 5;
  let sort = ""
  switch (req.query.sort) {
    case "newest":
      sort = "date";
      break;
    case "helpful":
      sort = "helpfulness";
      break;
    default:
      sort = "date";
  }

  let query = `SELECT
   reviews.review_id,
   reviews.rating,
   to_timestamp(reviews.date/1000) AS date,
   summary,
   reviews.body,
   reviews.recommend,
   reviews.reviewer_name,
   reviews.response,
   reviews.helpfulness,
   json_agg(json_build_object('id', reviews_photos.id, 'url', reviews_photos.url)) AS photos
   FROM reviews LEFT JOIN reviews_photos
   ON reviews_photos.review_id = reviews.review_id
   WHERE reviews.product_id=${req.query.product_id}
   GROUP BY reviews.review_id
   ORDER BY ${sort} desc
   Limit ${count};`
  db.query(query).then((data) => {
    console.log("sucess query db", data)
    res.send(data);
  }).catch((err) => {
    console.log(err);
  })
});
app.post('/reviews', async (req, res) => {
  //console.log(req.body);
  let {
    rating,
    summary,
    body,
    recommend,
    name,
    email,
    photos,
    characteristics
  } = req.body;
  let product_id = req.query.product_id;
  const review_id = await db.query(`SELECT MAX(review_id) FROM reviews`);
  const photo_id = await db.query(`SELECT MAX(id) FROM reviews_photos`);
  const characteristics_id = await db.query(`SELECT MAX(id) FROM characteristic_reviews`);
  await db.none('INSERT INTO reviews (review_id, product_id, rating, date, summary,body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12)', [review_id[0].max + 1, product_id, rating, Date.now(), summary, body, recommend, false, name, email, null, 0])
    .then(() => {
      console.log("insert sucess")
      res.sendStatus(201)
    }).catch(err => console.log(err));

  //insert photos to reviews_photos table
  if (photos.length !== 0) {
    for (let i = 0; i < photos.length; i++) {
      db.none(`INSERT INTO reviews_photos (id, review_id, url) VALUES ($1,$2,$3)`, [photo_id[0].max + 1 + i, review_id[0].max + 1, photos[i]])
        .then(() => {
          console.log("photo insert sucess")
        }).catch((err) => { console.log(err) })
    }
  }
  //insert characteristics to characteristics_reviews
  if (Object.keys(characteristics).length !== 0) {
    for (let i = 0; i < Object.keys(characteristics).length; i++) {
      console.log(`SELECT id FROM characteristics Where product_id=${product_id} AND name=${Object.keys(characteristics)[i]};`)
      let char_id = await db.query(`SELECT id FROM characteristics Where product_id=${product_id} AND name=${Object.keys(characteristics)[i]};`);
      await db.none(`INSERT INTO characteristic_reviews (id, characteristic_id, review_id, value) VALUES ($1,$2,$3)`, [characteristics_id[0].max + 1 + i, char_id, review_id[0].max + 1, characteristics[Object.keys(characteristics)[i]]])
        .then(() => {
          console.log("photo insert sucess")
        }).catch((err) => { console.log(err) })
    }

  }

})
app.put("/reviews/helpful", ((req, res) => {
  const review_id = req.query.review_id;
  const query = `UPDATE reviews
      SET
        helpfulness = helpfulness + 1
      WHERE
        review_id = ${review_id};`;
  db.query(query)
    .then(() => {
      console.log("helpful put req sucess");
    }).catch(err => console.log(err))

}))
app.put("/reviews/report", ((req, res) => {
  const review_id = req.query.review_id;
  const query = `UPDATE reviews
      SET
      reported = true
      WHERE
        review_id = ${review_id};`;
  db.query(query)
    .then(() => {
      console.log("report put req sucess");
    }).catch(err => console.log(err))

}))



app.listen(PORT, () => {
  console.log(`Server listening at localhost:${3000}!`);
});