const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  bcrypt = require("bcryptjs"),
  User = require("../models").User;

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(function(username, password, done) {
      User.find({ where: { username: username } })
        .then(user => {
          if (!user) {
            console.log("No User");
            return done(null, false);
          }
          bcrypt.compare(password, user.password).then(res => {
            if (res) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        })
        .catch();
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.dataValues.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id)
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      })
      .catch(err => done(err, false));
  });
};
