const express = require("express");
const router = express.Router();
const path = require("path");
const Book = require("../models/book");
const Author = require("../models/author");

const imageMimeType = ["image/jpeg", "image/png", "image/gif"];

// get all books
router.get("/", async (req, res) => {
  let searchQuery = Book.find();
  if (req.query.title) {
    searchQuery = searchQuery.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishAfter) {
    searchQuery = searchQuery.gte(
      "publishDate",
      new Date(req.query.publishAfter)
    );
  }
  if (req.query.publishBefore) {
    searchQuery = searchQuery.lte(
      "publishDate",
      new Date(req.query.publishBefore)
    );
  }

  await searchQuery
    .exec()
    .then((books) => {
      res.render("books/index", {
        books: books,
        searchOptions: req.query,
      });
    })
    .catch((err) => {
      res.redirect("/");
    });
});

// new book
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// add book
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });

  await Book.findOne({ title: book.title })
    .then((existing) => {
      if (existing) {
        throw new Error("Book already exists!");
      } else {
        saveBook(res, book, req.body.cover);
      }
    })
    .catch((err) => {
      renderNewPage(res, book, true, err.message);
    });
});

async function saveBook(res, book, coverEncoded) {
  if (!coverEncoded) return;
  const cover = JSON.parse(coverEncoded);
  if (cover && imageMimeType.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
    await book
      .save()
      .then((newBook) => {
        res.redirect("/books");
      })
      .catch((err) => {
        renderNewPage(res, book, err.message);
      });
  }
}

async function renderNewPage(res, book, message = null) {
  await Author.find()
    .then((authors) => {
      res.render("books/new", {
        authors: authors,
        book: book,
        errorMessage: message,
      });
    })
    .catch((err) => {
      res.redirect("/");
    });
}

module.exports = router;
