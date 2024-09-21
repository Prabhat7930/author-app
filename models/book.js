const mongoose = require("mongoose");

const coverImagePath = "uploads/book-covers";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "author",
  },
  description: {
    type: String,
  },
  publishedDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  coverImage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("book", bookSchema);
module.exports.coverImagePath = coverImagePath;
