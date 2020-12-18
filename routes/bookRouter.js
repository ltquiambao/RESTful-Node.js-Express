const express = require('express');
const bookRouter = express.Router();

bookRouter.route('/books')
  .get((req, res) => {
    const response = { hello: "This is my API" }
    res.json(response);
  });

module.exports = bookRouter;