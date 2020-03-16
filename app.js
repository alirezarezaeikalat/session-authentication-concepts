const express = require('express');
const mongoose = require('mongoose');
const sessions = require('client-sessions');
const routes = require('./routes/router');
const bodyParser = require('body-parser');
const passwords = require('./config/secrets');
const User = require('./models/User');

const app = express();

mongoose.connect("mongodb://localhost/ss-auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(err => console.log(err.reason));

// setting view engines
app.set('view engine', 'ejs');
// using body-parser
app.use(bodyParser.urlencoded({
  extended: false
}));

// using sessions
app.use(sessions({
  cookieName: "session",
  secret: passwords.session,
  duration: 30 * 60 * 1000,
  httpOnly: true, // don't let js code access cookie
  secure: true // only set cookie over https
}));

// smart user middleware
app.use(async(req, res, next) => {
  let user;
  if(!(req.session && req.session.userId)){
    return next();
  }
  try {
    user = await User.findById(req.session.userId);
    if(!user) {
      return next();
    }
  } catch(err) {
    return next(err);
  }
  user.password = undefined;
  req.user = user;
  res.locals.user = user;
  next();
})

// using routing
app.use(routes);



app.listen(3000, () => {
  console.log('Ther server is now runnig on port 3000');
});