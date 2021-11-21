import db from "./database"
import server from "./index.js"
describe('get reviews', () => {

 test("Data Base connected", async () => {
    let testing = await db.query(`select * from reviews where review_id = 1`);
    console.log(testing);
    expect(testing).not.toBe(undefined);
  });


});

