var mysql2 = require('mysql2');

require('dotenv').config();

var connection = mysql2.createConnection({
  host: 'biqtzwqiihjmw2npadtd-mysql.services.clever-cloud.com',
  user: 'ugdo5cy8qombfwq4',
  password: 'A4qFZmXD54zeFiZRzcq4',
  database: 'biqtzwqiihjmw2npadtd',
});

module.exports = connection;
