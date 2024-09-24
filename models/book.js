const mongoose = require("mongoose");
const path = require("path");

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

bookSchema.virtual("cover").get(function () {
  console.log(this.coverImage.toString("base64"));
  if (this.coverImage && this.coverImageType) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});

// data:image/jpeg;charset=utf-8;base64;v4785h6n3487v65y873

module.exports = mongoose.model("book", bookSchema);
