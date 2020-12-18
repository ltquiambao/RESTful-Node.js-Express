// require necessary packages
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('app');

// setup db connection string
const connectionString = 'mongodb://localhost:27017/bookAPI';
// setup port configured from package.json > nodemonConfig
const port = process.env.PORT || 3000;

// initialize server
const app = express();
// initialize db connection
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const BookModel = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter')(BookModel);

// router
app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my API');
});

app.listen(port, () => {
  debug(`Running on port ${port}`);
});
