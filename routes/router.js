const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

// homepage
router.get('/', (req, res) => {
  res.render('index');
});

// register
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async function(req, res) {
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

})

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
    if(!user || req.body.password !== user.password){
      return res.render('login', {
        error: 'Check email and password',
        email: req.body.email
      });
    }
    
  } catch(err) {
    return res.render("login", {
      error: 'Check email and password',
      email: req.body.email
    });
  }
  res.redirect("/dashboard");
});

// dashboard
router.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

module.exports = router;