var mysql2 = require('mysql2');

require('dotenv').config();

var connection = mysql2.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

module.exports = connection;
