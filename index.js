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
app.post('/reviews', (req, res) =>{
  console.log(req.body)
})





app.listen(PORT, () => {
  console.log(`Server listening at localhost:${3000}!`);
});