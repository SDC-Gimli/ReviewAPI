const express = require('express');
const axios = require('axios');
const PORT = 3000;
const app = express();
const db = require('./database');
require ('regenerator-runtime/runtime')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/reviews", (req, res) => {

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
    data.forEach((review)=>{
      if(review.response==="null"){
        review.response=null;
      }
    })
    res.send(data);
  }).catch((err) => {
    console.log(err);
  })
});

app.get("/reviews/:product_id/meta", async (req, res) => {
  const product_id = req.query.product_id;
  const Output = { product_id };
  const ratingQuery = `SELECT json_build_object(
    '1', sum(CASE WHEN reviews.rating = 1 THEN 1 ELSE 0 END),
    '2', sum(CASE WHEN reviews.rating = 2 THEN 1 ELSE 0 END),
    '3', sum(CASE WHEN reviews.rating = 3 THEN 1 ELSE 0 END),
    '4', sum(CASE WHEN reviews.rating = 4 THEN 1 ELSE 0 END),
    '5', sum(CASE WHEN reviews.rating = 5 THEN 1 ELSE 0 END)) AS ratings
    FROM
      reviews WHERE reviews.product_id = ${product_id}
    GROUP BY
      reviews.product_id;`;
  const recommendQuery = `SELECT json_build_object(
        'true', sum(CASE WHEN reviews.recommend = true THEN 1 ELSE 0 END),
        'false', sum(CASE WHEN reviews.recommend = false THEN 1 ELSE 0 END)) AS recommended
        FROM
          reviews WHERE product_id = ${product_id}
        GROUP BY
          reviews.product_id;`
  const characteristicsQuery = `SELECT characteristic_reviews.characteristic_id, AVG(characteristic_reviews.value), characteristics.name
      FROM
        characteristic_reviews
      INNER JOIN
        characteristics
      ON
        characteristic_reviews.characteristic_id = characteristics.id
      WHERE
        product_id = ${product_id}
      GROUP BY
        characteristic_reviews.characteristic_id, characteristics.name;`;

  let ratingData = await db.query(ratingQuery).catch((err)=>console.log(err,"get rating Data"));
  let characteristicsData = await db.query(characteristicsQuery).catch((err)=>console.log(err,"get char Data"));
  let recommendData = await db.query(recommendQuery).catch((err)=>console.log(err,"get recommend Data"));
  Output.ratings = ratingData[0].ratings;
  Output.recommended = recommendData[0].recommended;
  Output.characteristics = {};
  characteristicsData.forEach((item) => {
    Output.characteristics[item.name] = { id: item.characteristic_id, value: (+item.avg).toFixed(4) }
  })

  res.send(Output);
})


app.post('/reviews', async (req, res) => {
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
        .catch((err) => { console.log(err) })
    }
  }
  //insert characteristics to characteristics_reviews
  if (Object.keys(characteristics).length !== 0) {
    for (let i = 0; i < Object.keys(characteristics).length; i++) {
      let char_id = await db.query(`SELECT id FROM characteristics Where product_id=${product_id} AND name='${Object.keys(characteristics)[i]}';`);
      await db.none(`INSERT INTO characteristic_reviews (id, characteristic_id, review_id, value) VALUES ($1,$2,$3,$4)`, [characteristics_id[0].max + 1 + i, char_id[0].id, review_id[0].max + 1, characteristics[Object.keys(characteristics)[i]]])
        .catch((err) => { console.log(err) })
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
      res.sendStatus(204);
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
     res.sendStatus(204);
    }).catch(err => console.log(err))

}))



app.listen(PORT, () => {
  console.log(`Server listening at localhost:${3000}!`);
});