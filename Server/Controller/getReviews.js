const db = require("../../database");
require('regenerator-runtime/runtime');
const getReviews = (req, res) => {
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
      sort = "summary";
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
    data.forEach((review) => {
      if (review.response === "null") {
        review.response = null;
      }
    })
    res.send(data);
  }).catch((err) => {
    console.log(err);
  })
}

module.exports = getReviews;