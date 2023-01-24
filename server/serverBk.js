const express = require('express');
const mongoose = require('mongoose');
const Regisshow = require('./regisshows');
const cors = require('cors');

const bodyParser = require("body-parser");

const app = express();
mongoose.set('strictQuery', true);

// connect to the database
mongoose.connect('mongodb://127..1:27017/scoreboard', {useNewUrlParser: true});

// define routes and middleware
app.get('/', function (req, res) {
  res.send('Hello, World!');
});

// app.get('/regisshow', function(req, res) {
//   // find all documents in the regisshow collection
//   Regisshow.find({}, function(err, regisshows) {
//     if (err) return res.status(500).send(err);
//     console.log(regisshow);
//     return res.send(regisshow);
//   });
// });

app.get('/regisshow', function(req, res) {
  // find all documents in the regisshows collection
  Regisshow.find({}, function(err, regisshows) {  // update the collection name here
    if (err) return res.status(500).send(err);
    console.log(regisshows);
    return res.send(regisshows);
  });
});


app.post('/users', function (req, res) {
  // create a new user
});

// start the server
const PORT = 50100;
app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`);
});

// Access-Control-Allow-Origin: *

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
