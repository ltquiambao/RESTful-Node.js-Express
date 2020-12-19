// require necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const debug = require('debug')('app');

// setup db connection string
let connectionString;
if (process.env.ENV === 'Test') {
  console.log('This is a test');
  connectionString = 'mongodb://localhost:27017/bookAPI_Test';
} else {
  console.log('This is NOT a test');
  connectionString = 'mongodb://localhost:27017/bookAPI';
}
// setup port configured from package.json > nodemonConfig
const port = process.env.PORT || 3000;

// initialize server
const app = express();
// initialize db connection
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const Book = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter')(Book);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// router
app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my API');
});

app.server = app.listen(port, () => {
  debug(`Running on port ${port}`);
});

module.exports = app;
