const pgp = require('pg-promise')();
const token = require('../config.js');
const databaseConfig = {
  //host: "localhost",
  user: token.user,
  password: token.password,
  port: 5432,
  database: "postgres"
}
const database =  pgp(databaseConfig);
database.connect();
module.exports = database;
