const express = require('express');
const path = require('path');
const debug = require('debug')(`app:${path.basename(__filename, '.js')}`);

function router(Book) {
  const bookRouter = express.Router();

  const queryHandler = (reqQuery) => {
    const query = {};
    if (reqQuery.title) query.title = reqQuery.title;
    if (reqQuery.author) query.author = reqQuery.author;
    if (reqQuery.genre) query.genre = reqQuery.genre;
    if (reqQuery.read === 'true' || reqQuery.read === 'false') query.read = reqQuery.read;
    return query;
  };

  bookRouter.route('/books')
    .get((req, res) => {
      const query = queryHandler(req.query);
      debug(`method: ${req.method}\nurl: ${req.url}\nquery: ${query}`);
      Book.find(query)
        .then((books) => res.json(books))
        .catch((err) => res.send(err));
    })
    .post((req, res) => {
      const book = new Book(req.body);
      debug(`method: ${req.method}\nurl: ${req.url}\id: ${book.id}`);
      book.save()
        .then((book) => res.status(201).json(book));
    });

  bookRouter.use('/books/:bookId', (req, res, next) => {
    const { bookId } = req.params;
    debug(`method: ${req.method}\nurl: ${req.url}\nid: ${bookId}`);
    Book.findById(bookId)
        .then((book) => {
          if(book) {
            req.book = book;
            return next();
          }
          return res.sendStatus(404);
        })
        .catch((err) => res.send(err));
  });

  bookRouter.route('/books/:bookId')
    .get((req, res) => res.json(req.book))
    .put((req, res) => {
      const { title, author, genre, read } = req.body;
      const { book } = req;
      book.title = title;
      book.author = author;
      book.genre = genre;
      book.read = read;
      book.save()
        .then((book) => res.json(book))
        .catch((err) => res.send(err));
    })
    .patch((req, res) => {
      const { book } = req;
      Object.entries(req.body).forEach((item) => {
        const [ key, value ] = item; 
        book[key] = key === '_id' ? book[key] : value;
      });
      book.save()
        .then((book) => res.json(book))
        .catch((err) => res.send(err));
    })
    .delete((req, res) => {
      const { book } = req;
      book.remove()
        .then(() => res.statusCode(204))
        .catch((err) => res.send(err));
    })

  return bookRouter;
}

module.exports = router;
