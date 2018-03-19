const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../models");
const { ensureAuthenticated } = require("../helpers/auth");
// These endpoints exist after /users
router.post("/", (req, res) => {
  db.User.create({
    username: "Kyle",
    password: "54321"
  }).then(user => {
    res.status(200).json({
      msg: "Account created",
      user: user
    });
  });
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users/success",
    failureRedirect: "/users/failure"
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.send("logged out");
});

router.get("/success", (req, res, next) => {
  console.log(req.session);
  res.send(req.session.passport);
});

router.get("/failure", (req, res) => {
  res.send("Failed to log in");
});

router.get("/protected", ensureAuthenticated, (req, res) => {
  res.send("Congratulations! You made it to the protected content. Good Work!");
});

module.exports = router;
