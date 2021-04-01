if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const Names = require('../database/names');
const Users = require('../database/users');
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('../passport-config')
initializePassport(
  passport,
  (email) => {
    return Users.findOne({
      email: email,
    })
      .then((data) => {
        return data;
      });
  },
  (id) => {
    return Users.findOne({
      id: id,
    })
      .then((data) => {
        return data;
      });
  }
)

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));


/************************************************************/
// Authentication routes
/************************************************************/

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    Users.create({
      id: Date.now().toString(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword
    });
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}


/************************************************************/
// Application routes
/************************************************************/

app.post('/names', (req, res) => {
  Names.create({
	name: req.body.name,
	id: req.body.id
  })
	.then(() => res.send(201))
	.catch((err) => {
  	console.log(err);
  	res.send(500);
	})
});

app.get('/names', function (req, res) {
  Names.find({})
  .then((data) => res.send(data))
  .catch((err) => res.send(err));
})

app.options('/names', (req, res) => {
  Names.deleteMany({})
  .then(() => res.send(201))
  .catch((err) => res.send(err));
})

module.exports = app;
