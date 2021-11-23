import db from "./database"
import server from "./Server"
import getReviews from "./Server/Controller/getReviews"
import getReviewMeta from "./Server/Controller/getReviewMeta"
import postReview from "./Server/Controller/postReview"
import updateHelpful from "./Server/Controller/updateHelpful"
import updateReport from "./Server/Controller/updateReport"
import axios from "axios"
const apiUrl = `http://localhost:3000`;
test("Data Base connected", async () => {
  let testing = await db.query(`select * from reviews where review_id = 1`).catch((err)=>{console.log(err)});
  //console.log(testing);
  expect(testing).not.toBe(undefined);
});

describe('test GET /reviews api endpoint', () => {
  it('should response reviews data', async () => {
    let res = await axios.get(`${apiUrl}/reviews`,{params:{product_id:1000011}});
    expect(res.data).not.toBe([]);
    expect(Object.keys(res.data[0])).toMatchObject([
      'review_id',
      'rating',
      'date',
      'summary',
      'body',
      'recommend',
      'reviewer_name',
      'response',
      'helpfulness',
      'photos'
    ]);

  });

});

describe('test GET /reviews/meta api endpoint', () => {
  it('should response reviewsMeta data', async () => {
    let res = await axios.get(`${apiUrl}/reviews/:product_id/meta`,{params:{product_id:1000011}});
    expect(res.data).not.toBe([]);
    expect(Object.keys(res.data)).toMatchObject([ 'product_id', 'ratings', 'recommended', 'characteristics' ]);

  });

});

describe('test POST /reviews/meta api endpoint', () => {
  let postBody ={

      "rating": 5,
      "recommend": true,
      "characteristics": {},
      "summary": "testing from jest post test",
      "body": "jest post test",
      "email": "km@gmail.com",
      "name": "KM",
      "photos": []

  }
  it('should add data to database', async () => {
    let review_id=await db.query('select MAX(review_id) from reviews');
    let res = await axios.post(`${apiUrl}/reviews`,postBody,{params:{product_id:1000010},});
    let newMax = await db.query('select MAX(review_id) from reviews');
    expect(res.status).toBe(201);
    expect(newMax[0].max).toEqual(review_id[0].max+1);
    db.query(`delete from reviews where review_id=${review_id[0].max+1}`)
  });

});

describe('test PUT /reviews/helpful api endpoint', () => {
  it('should update helpfulness count', async () => {
   let helpCount = await db.query(`select helpfulness from reviews where review_id=5774966`)
    let res = await axios.put(`${apiUrl}/reviews/helpful`,{helpfulness:helpCount[0].helpfulness+1},{params:{review_id:5774966}});
    let afterCount = await db.query(`select helpfulness from reviews where review_id=5774966`);
    db.query(`update reviews set helpfulness=${helpCount[0].helpfulness} where review_id=5774966`)
    expect(res.status).toBe(204)
    expect(helpCount[0].helpfulness).toEqual(afterCount[0].helpfulness-1);
  });

});

describe('test PUT /reviews/report api endpoint', () => {
  it('should set reported true', async () => {
    let res = await axios.put(`${apiUrl}/reviews/report`,{reported:true},{params:{review_id:5774966}});
    let report = await db.query(`select reported from reviews where review_id = 5774966`)
    db.query(`update reviews set reported=false where review_id=5774966`)
    expect(res.status).toBe(204)
    expect(report[0].reported).toEqual(true);
  });

});