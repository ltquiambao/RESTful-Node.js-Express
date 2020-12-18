const mongoose = require('mongoose');

const { Schema } = mongoose;

// setup schema for books
const bookSchema = new Schema({
  title: String,
  author: String,
  genre: String,
  read: {
    type: Boolean,
    default: false
  }
});

// create model from defined book schema
const bookModel = mongoose.model('Book', bookSchema);

module.exports = bookModel;
