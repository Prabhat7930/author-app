const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Book = require("../models/book");
const uploadPath = path.join("public", Book.coverImagePath);
const Author = require("../models/author");

const imageMimeType = ["images/jpeg", "images/jpg", "images/png", "images/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeType.includes(file.mimetype));
  },
});

// all books
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.title != null && req.query.title !== "") {
    searchOptions.title = new RegExp(req.query.title, "i");
  }
  await Book.find(searchOptions)
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
  await Author.find()
    .then((authors) => {
      console.log(authors);
      res.render("books/new", {
        book: new Book(),
        authors: authors,
      });
    })
    .catch((err) => {
      res.redirect("/books");
    });
});

// add book
router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImage: fileName,
    description: req.body.description,
  });

  findBook(res, book, saveBook);
});

async function findBook(res, book, saveBook) {
  await Book.findOne({ title: book.title })
    .then((existing) => {
      if (existing) {
        throw new Error("Book already exists!");
      } else {
        saveBook(res, book);
      }
    })
    .catch((err) => {
      res.render("books/new", {
        book: book,
        errorMessage: err.message,
      });
    });
}

async function saveBook(res, book, hasError = false) {
  await book
    .save()
    .then((newBook) => {
      res.redirect("/books");
    })
    .catch((err) => {
      res.render("books/new", {
        book: book,
        errorMessage: "Error adding the book",
      });
    });
}

module.exports = router;
