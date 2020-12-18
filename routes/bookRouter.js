const express = require('express');
const path = require('path');
const debug = require('debug')(`app:${path.basename(__filename, '.js')}`)

const router = express.Router();

function bookRouter(Books) {
  const queryHandler = (reqQuery) => {
    const query = {};
    if (reqQuery.title) query.title = reqQuery.title;
    if (reqQuery.author) query.author = reqQuery.author;
    if (reqQuery.genre) query.genre = reqQuery.genre;
    if (reqQuery.read === 'true' || reqQuery.read === 'false') query.read = reqQuery.read;
    return query;
  };

  router.route('/books')
    .get((req, res) => {
      const query = queryHandler(req.query);
      debug(query);
      Books.find(query)
        .then((books) => res.json(books))
        .catch((err) => res.send(err));
    });

  router.route('/books/:bookId')
    .get((req, res) => {
      const { bookId } = req.params;
      Books.findById(bookId)
        .then((book) => res.json(book))
        .catch((err) => res.send(err));
    });

  return router;
}

module.exports = bookRouter;
