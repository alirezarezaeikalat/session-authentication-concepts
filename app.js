const express = require('express');
const mongoose = require('mongoose');
const sessions = require('client-sessions');
const routes = require('./routes/router');
const bodyParser = require('body-parser');

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
app.use(routes);



app.listen(3000, () => {
  console.log('Ther server is now runnig on port 3000');
});