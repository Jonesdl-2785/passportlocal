const express = require("express"),
  router = express.Router(),
  { ensureAuthenticated } = require("../helpers/auth"),
  Post = require("../models").Post;

router.post("/", ensureAuthenticated, (req, res) => {
    Post.create({ title: req.body.title, UserId: req.user.id }).then(result => {
        res.status(200).json({
            message: "This is a post",
            post: result
        });
    });
});

module.exports = router;