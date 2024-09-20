const express = require("express");
const router = express.Router();
const Author = require("../models/author");

// all authors
router.get("/", async (req, res) => {
  await Author.find()
    .then((authors) => {
      res.render("authors/index", {
        authors: authors,
      });
    })
    .catch((err) => {
      res.redirect("/");
    });
});

// new author
router.get("/new", (req, res) => {
  res.render("authors/new", {
    author: new Author(),
  });
});

// create author
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });

  await Author.findOne({ name: author.name })
    .then((existing) => {
      if (existing) {
        throw new Error("Author Exists");
      } else {
        author
          .save()
          .then((newAuthor) => {
            res.redirect("/authors");
            return;
          })
          .catch((err) => {
            res.render("authors/new", {
              author: author,
              errorMessage: "Error creating the author!",
            });
          });
      }
    })
    .catch((err) => {
      res.render("authors/new", {
        author: author,
        errorMessage: err.message,
      });
    });
});

module.exports = router;
