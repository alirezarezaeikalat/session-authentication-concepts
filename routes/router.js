const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bycrypt = require('bcryptjs');

// homepage
router.get('/', (req, res) => {
  res.render('index');
});

// register
router.get('/register', (req, res) => {
  let user = new User();
  res.render('register', {
    user: user 
  });
});

router.post('/register', async function(req, res) {
  let hash = bycrypt.hashSync(req.body.password);
  req.body.password = hash;
  let user = new User(req.body);
  let error = '';
  try{
    await user.save(user);
  } catch(err){
    error = 'something bad happened, please try again later';
    if(err.code === 11000){
      error = 'The email is already taken';
    }
    user.password = undefined;
    return res.render('register', {
      error: error,
      user: user
    });
  }
  res.redirect('/dashboard');

});

// login
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  let user;
  try {
    user = await User.findOne({
      email: req.body.email
    });
    // checking user and password
    if(!user || !bycrypt.compareSync(req.body.password, user.password)){
      return res.render('login', {
        error: 'Check email and password',
        email: req.body.email
      });
    }
  } catch(err) {
    return res.render("login", {
      error: 'problem with database',
      email: req.body.email
    });
  }
  // if there is user 
  req.session.userId = user._id;
  res.redirect("/dashboard");
});

// dashboard
function isLoginRequired(req, res, next) {
  if(!req.user) {
    return res.redirect('/login');
  }
  next();
}
router.get('/dashboard', isLoginRequired, async (req, res, next) => {
  
  res.render('dashboard');
});

module.exports = router;