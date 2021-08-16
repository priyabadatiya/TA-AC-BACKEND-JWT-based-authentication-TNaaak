var express = require("express");
var router = express.Router();
var Book = require("../models/books");
var Comment = require("../models/comments");
var auth = require("../middlewares/auth");

/* GET users listing. */

router.use(auth.verifyToken);

router.post("/:id", async (req, res) => {
  try {
    req.body.userId = req.user.userId;
    req.body.bookId = req.params.id;
    const comment = await Comment.create(req.body);
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $push: { commentId: comment._id } },
      { new: true }
    );
    console.log(book);
    res.json({ book: book });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.userId.toString() === req.user.userId) {
      const updateComment = await Comment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json({ updateComment, comment });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (req.user.userId.toString() === req.comment.userId.toString()) {
      const commentDelete = await Comment.findByIdAndDelete(req.params.id);
      const updateBook = await Book.findByIdAndUpdate(commentDelete.bookID, {
        $pull: { commentId: commentDelete._id },
      });
      res.json(updateBook);
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
