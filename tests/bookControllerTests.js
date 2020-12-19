require('should');
const sinon = require('sinon');
const bookController = require('../controllers/bookController');

describe('Book Controller Tests:', () => {
  describe('Post', () => {
    it('should not allow an empty title on post', () => {
      // create a mock Book with 'save' method
      class Book {
        constructor(book) {
          this.book = book;
          this.save = () => {};
        }
      }

      // mock request with missing 'title'
      const req = {
        body: {
          author: 'John'
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
    });
  });
});
