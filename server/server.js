const express = require('express');
const mongoose = require('mongoose');
const Regisshow = require('./regisshows');
const Onboardshows = require('./onboardshows');
const Onboardlands = require('./onboardlands');
const Onboardlandnums = require('./onboardlandnums');
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(bodyParser.json());

mongoose.set('strictQuery', true);

// connect to the database
mongoose.connect('mongodb+srv://teeramail:qvdrYkGpm6MLJx8H@cluster0.gk51ki6.mongodb.net/scoreboard', {useNewUrlParser: true});

// define routes and middleware
app.get('/', function (req, res) {
  res.send('Hello, World!');
});

// app.get('/regisshow', function(req, res) {
//   // find all documents in the regisshow collection
//   Regisshow.find({}, function(err, regisshows) {
//     if (err) return res.status(500).send(err);
//     if (regisshows.length === 0) return res.status(404).send('No documents found in the collection');
//     console.log(regisshows);
//     return res.send(regisshows);
//   });
// });

app.get('/regisshow', function(req, res) {
  // find all documents in the regisshow collection
  Regisshow.find({idshow : request.query['idshow']}, function(err, regisshows) {
    if (err) return res.status(500).send(err);
    if (regisshows.length === 0) return res.status(404).send('No documents found in the collection');
    console.log(regisshows);
    return res.send(regisshows);
  });
});

// database.collection("po_order").find({customername : request.query['customername']})

app.get('/onboardshows', function(req, res) {
  // find all documents in the onboarshows collection
  Onboardshows.find({}, function(err, onboardshows) {
    if (err) return res.status(500).send(err);
    if (onboardshows.length === 0) return res.status(404).send('No documents found in the collection');
    console.log(onboardshows);
    return res.send(onboardshows);
  });
});

app.get('/onboardlands', function(req, res) {
  // find all documents in the onboarshows collection
  Onboardlands.find({}, function(err, onboardlands) {
    if (err) return res.status(500).send(err);
    if (onboardlands.length === 0) return res.status(404).send('No documents found in the collection');
    console.log(onboardlands);
    return res.send(onboardlands);
  });
});

app.get('/onboardlandnums', function(req, res) {
  // find all documents in the onboarshows collection
  Onboardlandnums.findOne({}, function(err, onboardlandnums) {
    if (err) return res.status(500).send(err);
    if (onboardlandnums.length === 0) return res.status(404).send('No documents found in the collection');
    console.log(onboardlandnums);
    return res.send(onboardlandnums);
  });
});

app.put('/regisshow', function(req, res) {
  console.log('Request body:', req.body); // add this line to log the request body
  const idshow = req.body['idshow'];
  
  // the rest of your code goes here
  Regisshow.findOneAndUpdate({ idshow: idshow }, { $inc: { numbershow: 1 } }, { new: true }, (err, regisshow) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    if (!regisshow) {
      return res.status(404).send('Document not found');
    }
    return res.send(regisshow);
  });
});

app.put('/onboardshows', function(req, res) {
  console.log('Request body:', req.body); // add this line to log the request body
  const idshow = req.body['idshow'];
  
  // the rest of your code goes here
  Onboardshows.findOneAndUpdate({ idshow: idshow }, { $inc: { numbershow: 1 } }, { new: true }, (err, onboardshow) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    if (!onboardshow) {
      return res.status(404).send('Document not found');
    }
    return res.send(onboardshow);
  });
});

app.put('/onboardlands', function(req, res) {
  console.log('Request body:', req.body); // add this line to log the request body
  const idshow = req.body['idshow'];
  
  // the rest of your code goes here
  Onboardlands.findOneAndUpdate({ idshow: idshow }, { $inc: { numbershow: 1 } }, { new: true }, (err, onboardland) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    if (!onboardland) {
      return res.status(404).send('Document not found');
    }
    return res.send(onboardland);
  });
});

app.put('/onboardshowsminus', function(req, res) {
  console.log('Request body:', req.body); // add this line to log the request body
  const idshow = req.body['idshow'];
  
  // the rest of your code goes here
  Onboardshows.findOneAndUpdate({ idshow: idshow }, { $inc: { numbershow: -1 } }, { new: true }, (err, onboardshow) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    if (!onboardshow) {
      return res.status(404).send('Document not found');
    }
    return res.send(onboardshow);
  });
});

app.put('/onboardlandnums', (req, res) => {
  console.log('Request body:', req.body); // add this line to log the request body
  const idshow = req.body['idshow'];
  Onboardlandnums.findOneAndUpdate({}, {$inc: {numland: 1}}, {new: true}, (err, doc) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      Onboardlands.findOneAndUpdate({ idshow: idshow }, {$set: {numbershow: doc.numland}}, {new: true}, (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          res.status(200).json({ message: "updated successfully" });
        }
      });
    }
  });
});


  

// start the server
const PORT = 50100;
app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`);
});

// Access-Control-Allow-Origin: *



app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
  "Access-Control-Allow-Origin": "*"
}));
