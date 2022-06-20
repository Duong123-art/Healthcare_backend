const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:trueoptionSuccessStatus:200,
};

const app = express();

app.use(cors(corsOptions));

app.use(body_parser.json());

app.use(
  body_parser.urlencoded({
    extended: true,
  })
);

module.exports = app;

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server running on port ${port}`));

const connect = require('./API/connectdatabase');

if (connect) {
  connect.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('ket noi thanh cong');
    }
  });
} else {
  connect.release();
}

const route = require('./API/route');
const { JsonWebTokenError } = require('jsonwebtoken');
route(app);
