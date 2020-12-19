const express = require('express');
const bookController = require('../controllers/bookController');

function router(Book) {
  const bookRouter = express.Router();
  const controller = bookController(Book);

  bookRouter.route('/books')
    .get(controller.getByQuery)
    .post(controller.post);

  bookRouter.route('/books/:bookId')
    .all(controller.checkIDExists)
    .get(controller.getByID)
    .put(controller.put)
    .patch(controller.patch)
    .delete(controller.deleteBook);

  return bookRouter;
}

module.exports = router;
