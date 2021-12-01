const pgp = require('pg-promise')();
const token = require('../config.js');
const databaseConfig = {
  host: "18.144.57.220",
  //host:"localhost",
  user: token.user,
  password: token.password,
  port: 5432,
  database: "postgres"
}
const database =  pgp(databaseConfig);
console.log(token)
//database.connect();
module.exports = database;
