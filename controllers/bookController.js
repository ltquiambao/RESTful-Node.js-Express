const path = require('path');
const debug = require('debug')(`app:${path.basename(__filename, '.js')}`);

function bookController(Book) {
  const queryHandler = (reqQuery) => {
    const query = {};
    if (reqQuery.title) query.title = reqQuery.title;
    if (reqQuery.author) query.author = reqQuery.author;
    if (reqQuery.genre) query.genre = reqQuery.genre;
    if (reqQuery.read === 'true' || reqQuery.read === 'false') query.read = reqQuery.read;
    return query;
  };

  const getByQuery = (req, res) => {
    const query = queryHandler(req.query);
    debug(`method: ${req.method}\nurl: ${req.url}\nquery: ${JSON.stringify(query)}}`);
    Book.find(query)
      .then((books) => {
        const returnBooks = books.map((book) => {
          const newBook = book.toJSON();
          newBook.links = {};
          newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
          return newBook;
        });
        return res.json(returnBooks);
      })
      .catch((err) => res.send(err));
  };

  const getByID = (req, res) => {
    const { book } = req;
    const returnBook = book.toJSON();
    const genre = book.genre.replace(' ', '%20');
    returnBook.links = { FilterByThisGenre: `http://${req.headers.host}/api/books?genre=${genre}` };
    res.json(returnBook);
  };

  const post = (req, res) => {
    const book = new Book(req.body);
    debug(`method: ${req.method}\nurl: ${req.url}\nbody: ${JSON.stringify(book)}`);
    if (!req.body.title) {
      res.status(400);
      return res.send('Title is required');
    }
    book.save();
    res.status(201);
    return res.json(book);
  };

  const put = (req, res) => {
    const {
      title, author, genre, read
    } = req.body;
    debug(`method: ${req.method}\nurl: ${req.url}\nbody: ${JSON.stringify(req.body)}`);
    if (!title) {
      res.status(400);
      return res.send('Title is required');
    }
    const { book } = req;
    book.title = title;
    book.author = author;
    book.genre = genre;
    book.read = read;
    book.save();
    return res.json(book);
  };

  const patch = (req, res) => {
    const { book } = req;
    debug(`method: ${req.method}\nurl: ${req.url}\nbody: ${JSON.stringify(req.body)}`);
    Object.entries(req.body).forEach((item) => {
      const [key, value] = item;
      book[key] = key === '_id' ? book[key] : value;
    });
    book.save()
      .then((bookResponse) => {
        res.status(200);
        return res.json(bookResponse);
      })
      .catch((err) => res.send(err));
  };

  const deleteBook = (req, res) => {
    const { book } = req;
    book.remove()
      .then(() => res.statusCode(204))
      .catch((err) => res.send(err));
  };

  // middlewares
  const checkIDExists = (req, res, next) => {
    const { bookId } = req.params;
    debug(`method: ${req.method}\nurl: ${req.url}\nid: ${bookId}`);
    Book.findById(bookId)
      .then((book) => {
        if (book) {
          req.book = book;
          return next();
        }
        res.status(404);
        return res.send('Book Not Found');
      })
      .catch((err) => res.send(err));
  };

  return {
    getByQuery,
    getByID,
    post,
    put,
    patch,
    deleteBook,
    checkIDExists
  };
}

module.exports = bookController;
