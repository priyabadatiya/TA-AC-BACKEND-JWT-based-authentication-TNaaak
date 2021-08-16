var express = require("express");
var router = express.Router();
var Book = require("../models/books");
var Comment = require("../models/comments");
var auth = require("../middlewares/auth");

/* GET users listing. */

router.get("/", async (req, res) => {
  console.log(req.user);
  try {
    const books = await Book.find({}).populate("userId");
    res.status(200).json({ books: books });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.use(auth.verifyToken);

router.post("/", async (req, res) => {
  try {
    console.log(req.user);
    req.body.userId = req.user.userId;
    const book = await Book.create(req.body);
    console.log(book);
    res.status(200).json({ book });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book.userId.toString() === req.user.userId.toString()) {
      const updateBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json({ updateBook, book });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book.userId.toString() === req.user.userId.toString()) {
      const updateBook = await Book.findByIdAndDelete(req.params.id, req.body, {
        new: true,
      });
      const comment = await Comment.deleteMany({ bookId: book._id });
      res.json({ updateBook, book, comment });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await Book.distinct("category");
    res.json({ categories });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/category", async (req, res) => {
  try {
    const books = await Book.aggregate([
      { $match: { categories: req.params.category } },
    ]);
    res.json({ books });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/category", async (req, res) => {
  try {
    const books = await Book.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    res.json({ books });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/author", async (req, res) => {
  try {
    const book = await Book.aggregate([
      { $match: { author: req.params.author } },
    ]);
    res.json({ book });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("commentId");
    res.status(200).json({ book: book });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
