const express = require('express');
const path = require('path');
const debug = require('debug')(`app:${path.basename(__filename, '.js')}`);

function router(Book) {
  const bookRouter = express.Router();
  const bookController = require('../controllers/bookController')(Book);

  bookRouter.route('/books')
    .get(bookController.getByQuery)
    .post(bookController.post);

  // bookRouter.use('/books/:bookId', );
  bookRouter.route('/books/:bookId')
    .all(bookController.checkIDExists)
    .get(bookController.getByID)
    .put(bookController.put)
    .patch(bookController.patch)
    .delete(bookController.deleteBook);

  return bookRouter;
}

module.exports = router;
