const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.get("/", async (req, res) => {
  let query = Book.find();
  await query
    .sort({ createdAt: "desc" })
    .limit(10)
    .exec()
    .then((books) => {
      console.log("hi", Book.coverImagePath);
      res.render("index", {
        books: books,
        fileDir: Book.coverImagePath,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
