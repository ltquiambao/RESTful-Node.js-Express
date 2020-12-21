require('should');
const sinon = require('sinon');
const bookController = require('../controllers/bookController');

function unitTestsLogic() {
  const MOCK_METHOD = 'mock_METHOD';
  const MOCK_ID = 'mock_ID';
  const MOCK_URL = 'mock_URL';
  const MOCK_TITLE = 'mock_TITLE';
  const MOCK_AUTHOR = 'mock_AUTHOR';
  const MOCK_GENRE = 'mock_GENRE';
  const MOCK_READ = false;

  // create a mock Book
  class Book {
    constructor(book) {
      this._id = book._id;
      this.title = book.title;
      this.author = book.author;
      this.genre = book.genre;
      this.read = book.read || false;
    }

    save() {
      return new Promise((resolve, reject) => {
        resolve({
          read: this.read,
          _id: this._id,
          title: this.title,
          author: this.author,
          genre: this.genre
        });
      });
    }
  }

  const postWithEmptyTitle = () => {
    // mock request with missing 'title'
    const req = {
      method: 'POST',
      url: MOCK_URL,
      body: {
        author: MOCK_AUTHOR
      }
    };

    // mock res variable using sinon
    const res = {
      status: sinon.spy(),
      send: sinon.spy(),
      json: sinon.spy()
    };

    // run post method of book Controller
    const controller = bookController(Book);
    controller.post(req, res);

    // check if the req without 'title' would respond back correctly
    res.status.calledWith(400).should.equal(true, `Bad status ${res.status.args[0][0]}`);
    res.send.calledWith('Title is required').should.equal(true);
  };

  const putWithEmptyTitle = () => {
    // mock request with missing 'title'
    const req = {
      method: 'PUT',
      url: MOCK_URL,
      body: {
        author: MOCK_AUTHOR,
        genre: MOCK_GENRE,
        read: MOCK_READ
      }
    };

    // mock res variable using sinon
    const res = {
      status: sinon.spy(),
      send: sinon.spy(),
      json: sinon.spy()
    };

    // run put method of book Controller
    const controller = bookController(Book);
    controller.put(req, res);

    // check if the req without 'title' would respond back correctly
    res.status.calledWith(400).should.equal(true, `Bad status ${res.status.args[0][0]}`);
    res.send.calledWith('Title is required').should.equal(true);
  };

  const nonExistentID = async () => {
    const Book2 = {
      findById(bookId) {
        return new Promise((resolve, reject) => {
          try {
            if (bookId !== MOCK_ID) resolve(false);
          } catch (err) {
            reject(err);
          }
        });
      }
    };

    const req = {
      method: MOCK_METHOD,
      url: MOCK_URL,
      params: {
        bookId: `Non-existent ${MOCK_ID}`
      }
    };

    const res = {
      send: sinon.spy(),
      status: sinon.spy()
    };

    const next = () => 'next';

    const controller = bookController(Book2);
    await controller.checkIDExists(req, res, next);

    res.status.calledWith(404).should.equal(true, `Bad status ${res.status.args[0][0]}`);
    res.send.calledWith('Book Not Found').should.equal(true);
  };

  const patchOnlyAuthor = async () => {
    // mock request changing 'author' field
    const req = {
      method: 'PATCH',
      url: MOCK_URL,
      body: {
        author: `New ${MOCK_AUTHOR}`
      },
      book: new Book({
        read: MOCK_READ,
        _id: MOCK_ID,
        title: MOCK_TITLE,
        author: MOCK_AUTHOR,
        genre: MOCK_GENRE
      })
    };

    const correctResponse = req.book;
    correctResponse.author = req.body.author;

    const res = {
      status: sinon.spy(),
      send: sinon.spy(),
      json: sinon.spy()
    };

    const controller = bookController(Book);
    await controller.patch(req, res);

    res.status.calledWith(200).should.equal(true, `Bad status ${res.status.args[0][0]}`);
    res.json.calledWithExactly({ ...correctResponse }).should.equal(true);
  };

  return {
    postWithEmptyTitle,
    putWithEmptyTitle,
    nonExistentID,
    patchOnlyAuthor
  };
}

module.exports = unitTestsLogic();
