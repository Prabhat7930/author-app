const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

// get all authors
router.get("/", async (req, res) => {
  let searchQuery = Author.find();
  if (req.query.name) {
    searchQuery = searchQuery.regex("name", new RegExp(req.query.name, "i"));
  }
  await searchQuery
    .sort({ name: "asc" })
    .limit(10)
    .exec()
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

router.get("/:id", async (req, res) => {
  const authorId = req.params.id;
  await Author.findById(authorId)
    .then((author) => {
      showAuthorProfile(res, author);
    })
    .catch((err) => {
      res.redirect("/");
    });
});

async function showAuthorProfile(res, author) {
  await Book.find({ author: author._id })
    .then((books) => {
      res.render("authors/author.ejs", {
        author: author,
        books: books,
      });
    })
    .catch((err) => {
      res.redirect("/");
    });
}

router.get("/:id/edit", async (req, res) => {
  const authorId = req.params.id;
  await Author.findById(authorId)
    .then((author) => {})
    .catch((err) => {
      res.redirect("/");
    });
});

router.put("/:id", async (req, res) => {
  const authorId = req.params.id;
  const authorName = req.body.name;
  await Author.findByIdAndUpdate(authorId, { name: authorName })
    .then((updatedAuthor) => {
      res.redirect("/authors");
    })
    .catch((err) => {
      console.error(err.message);
      res.redirect("/");
    });
});

router.delete("/:id", async (req, res) => {
  const authorId = req.params.id;
  await Author.findByIdAndDelete(authorId)
    .then((deletedAuthor) => {
      res.redirect("/authors");
    })
    .catch((err) => {
      res.redirect("/authors");
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
