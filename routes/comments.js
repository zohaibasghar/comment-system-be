const express = require("express");
const Comment = require("../models/Comment");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.get("/", async function (req, res) {
  try {
    const comments = await Comment.find();
    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
});

router.post(
  "/",
  [
    body("name", "Name field in required!").exists(),
    body("email", "Enter a valid email!").isEmail(),
    body("comment", "Comment field is requried!").exists(),
  ],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const comment = await Comment.create(req.body);
      return res.status(201).json({
        message: "Thanks for your comment, we will get back to you soon!",
        comment,
      });
    } catch (error) {
      res.send({
        code: 401,
        error: true,
        message: error.message,
      });
    }
  }
);

router.delete("/", [body("id").exists()], async function (req, res) {
  try {
    const commentId = req.body.id;
    console.log(commentId)
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found!" });
    }
    return res
      .status(200)
      .json({ message: "Comment deleted successfully", comment });
  } catch (error) {
    return res.status(500).json(error);
  }
});
module.exports = router;
