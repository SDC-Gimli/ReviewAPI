const express = require('express');
const axios = require('axios');
const PORT = 3000;
const app = express();
const db = require('./database');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get("/reviews",(req,res)=>{
 console.log(req.query.product_id);
  let query = `SELECT
   reviews.review_id,
   reviews.rating,
   to_timestamp(reviews.date/1000) AS date,
   summary,
   reviews.body,
   reviews.recommend,
   reviews.reviewer_name,
   reviews.response,
   reviews.helpfulness
   FROM reviews
   WHERE reviews.product_id=${req.query.product_id};`
  db.query(query).then((data)=>{
      console.log("sucess query db",data)
      res
    }).catch((err)=>{
      console.log(err);
    })
  });


app.listen(PORT, () => {
  console.log(`Server listening at localhost:${3000}!`);
});