const db = require("../../database");
require ('regenerator-runtime/runtime');
const getReviewMeta = async (req, res) => {
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
  if (ratingData[0].ratings===undefined) {Output.ratings = {};}
  else{
    Output.ratings = ratingData[0].ratings;
  }


  Output.recommended = recommendData[0].recommended;
  Output.characteristics = {};
  characteristicsData.forEach((item) => {
    Output.characteristics[item.name] = { id: item.characteristic_id, value: (+item.avg).toFixed(4) }
  })

  res.send(Output);
}
module.exports = getReviewMeta;