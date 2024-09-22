const express = require("express");
const router = express.Router();
const Author = require("../models/author");

// get all authors
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  await Author.find(searchOptions)
    .then((authors) => {
      res.render("authors/index", {
        authors: authors,
        searchOptions: req.query,
      });
    })
    .catch((err) => {
      res.redirect("/");
    });
});

// new author
router.get("/new", (req, res) => {
  renderNewPage(res, new Author());
});

// add unique author
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });

  await Author.findOne({ name: author.name })
    .then((existing) => {
      if (existing) {
        throw new Error("Author Exists");
      } else {
        saveAuthor(res, author);
      }
    })
    .catch((err) => {
      renderNewPage(res, author, err.message);
    });
});

// save author
async function saveAuthor(res, author) {
  await author
    .save()
    .then((newAuthor) => {
      res.redirect("/authors");
    })
    .catch((err) => {
      renderNewPage(res, author, "Error adding the author!");
    });
}

// render new author
function renderNewPage(res, author, message = null) {
  res.render("authors/new", {
    author: author,
    errorMessage: message,
  });
}

module.exports = router;
