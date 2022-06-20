const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:trueoptionSuccessStatus:200,
};
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
//import {jwt} from 'jsonwebtoken'
// import {dotenv} from "./.ENV"
// dotenv.config();
// export { dotenv };
const app = express();
//const morgan = require('morgan');

app.use(cors(corsOptions));

app.use(body_parser.json());

app.use(
  body_parser.urlencoded({
    extended: true,
  })
);

module.exports = app;

const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

const connect = require('./API/connectdatabase');
const database = require('./API/connectdatabase.js');
connect.connect(function (err) {
  if (err) throw err;
  console.log('ket noi thanh cong');
});

//const route = require("./API/route");

//route(app);
