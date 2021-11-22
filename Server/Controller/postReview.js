const db = require("../../database");
require ('regenerator-runtime/runtime');
const postReview = async (req, res) => {
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

}
module.exports =postReview;