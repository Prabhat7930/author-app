const mongoose = require("mongoose");
const Book = require("./book");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

authorSchema.pre("findOneAndDelete", async function (next) {
  const query = this.getFilter();
  await Book.exists({ author: query._id })
    .then((hasBook) => {
      if (hasBook) {
        next(new Error("Author has books!"));
      } else {
        next();
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = mongoose.model("author", authorSchema);
