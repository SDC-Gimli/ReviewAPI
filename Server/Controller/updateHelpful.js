const db = require("../../database");
require ('regenerator-runtime/runtime');
const updateHelpful = (req, res) => {
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

}
module.exports = updateHelpful;