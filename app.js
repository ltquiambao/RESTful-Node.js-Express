const express = require('express');
const debug = require('debug')('app');

const app = express();
const port = process.env.PORT || 3000;

const bookRouter = require('./routes/bookRouter');
app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my API');
});

app.listen(port, () => {
  debug(`Running on port ${port}`);
});
