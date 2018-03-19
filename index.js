const express = require("express"),
  session = require("cookie-session"),
  passport = require("passport"),
  LocalStrategy = require('passport-local').Strategy;
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  Sequelize = require("sequelize"),
  sqlite = require("sqlite3");
  handlebars = require('express-handlebars').create({ defaultLayout: 'main'});

const models = require("./models");

const app = express();
const port = process.env.PORT || 3000;

const users = require("./routes/users");
const posts = require("./routes/posts");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    secret: "MySecretKeyThatNoOneWillEverKnowItsMine"
  })
);

require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/users", users);
app.use("/posts", posts);

models.sequelize.sync().then(function() {
  app.listen(port, function() {
    console.log("Port's a go!... on port " + port + " !");
  });
});
// View Engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// routes/passport
app.post('/newaccount', (req, res) => {
  'Users'({
    Name: req.body.name,
    Username: req.body.username,
    Email: req.body.email,
    Password: req.body.password,
    Confirm_Password: req.body.confirm-password
  });
});

app.post('/login', (req, res) => {
  'Admin'({
    Username: req.body.username,
    Password: req.body.password
  });
});

app.post('/login', passport.authenticate('local',
{ successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true })
);

// handlebars
//app.get('/login', (req, res) => {
//  res.render('login', { message: req.flash('error')
  //res.type('text/plain');
  //res.send('./views/login.handlebars')
// });
//});
app.get('/', function(req, res) {
    if(req.user) {res.render('user'), {
      Name: req.body.name,
      Username: req.body.username,
      Email: req.body.email,
      Password: req.body.password,
      Confirm_Password: req.body.confirm-password}}

    else

    if(!req.user) {res.render('newaccount')};
});

app.get('/login', function(req, res) {
    if(req.user) {res.render('user'), {name:req.user.username, password:req.user.password}}

    else

    if(!req.user) {res.render('login')};
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
//app.get('/newaccount', (req, res) => {
  //res.render('newaccount', { message: req.flash('error')
  //res.type('text/plain');
  //res.send('./views/newaccount.handlebars')
  //});
//});

app.use((request, response) => {
    response.status(404);
    response.render('404');
});


app.post('/user', (req, res) => {
  const { body } = req;

  if (!body.username || !body.password || !body['confirm-password']) {
    req.flash('error', 'All fields are required!');
    return res.redirect('/newaccount');
  }

  if (body.password !== body['confirm-password']) {
    req.flash('error', 'Password did not match confirmation!');
    return res.redirect('/newaccount');
  }

  delete body['confirm-password'];

  User
    .forge(req.body)
    .save()
    .then((usr) => {
      res.send({id: usr.id});
    })
    .catch((error) => {
      console.error(error);
      return res.sendStatus(500);
    });
});
