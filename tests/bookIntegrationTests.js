require('should');

const request = require('supertest');
const mongoose = require('mongoose');

process.env.ENV = 'Test';

const app = require('../app');

const Book = mongoose.model('Book');
const agent = request.agent(app);

describe('Book CRUD Test', () => {
  it('should allow a book to be posted and return read and _id', (done) => {
    const bookPost = {
      title: 'My Book',
      author: 'My Author',
      genre: 'My Genre'
    };

    agent.post('/api/books')
      .send(bookPost)
      .expect(200)
      .end((err, res) => {
        res.body.read.should.equal(false);
        res.body.should.have.property('_id');
        done();
      });
  });

  // clean up database
  afterEach((done) => {
    Book.deleteMany({}).exec();
    done();
  });

  // close connection with db and server
  after((done) => {
    mongoose.connection.close();
    app.server.close(done());
  });
});
