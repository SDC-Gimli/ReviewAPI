const db = require("../../database");
require ('regenerator-runtime/runtime');
const updateReport = (req, res) => {
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

}
module.exports = updateReport;