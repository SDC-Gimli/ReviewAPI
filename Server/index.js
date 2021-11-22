const express = require('express');
const axios = require('axios');
const PORT = 3000;
const app = express();
const db = require('../database');
const getReviews = require("./Controller/getReviews");
const getReviewMeta = require("./Controller/getReviewMeta");
const postReview = require("./Controller/postReview");
const updateHelpful = require("./Controller/updateHelpful");
const updateReport = require("./Controller/updateReport");
require ('regenerator-runtime/runtime')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/reviews",getReviews);
app.get("/reviews/:product_id/meta", getReviewMeta);
app.post('/reviews', postReview);
app.put("/reviews/helpful", updateHelpful);
app.put("/reviews/report", updateReport);

app.listen(PORT, () => {
  console.log(`Server listening at localhost:${3000}!`);
});