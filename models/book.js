const mongoose = require("mongoose");
const path = require("path");

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
  publishDate: {
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
    type: Buffer,
    required: true,
  },
  coverImageType: {
    type: String,
    required: true,
  },
});

bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage) {
    return path.join("/", coverImagePath, this.coverImage);
  }
});

module.exports = mongoose.model("book", bookSchema);
module.exports.coverImagePath = coverImagePath;
