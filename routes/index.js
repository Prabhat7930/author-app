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
      res.render("index", {
        books: books,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
