require('dotenv').config();
const express = require('express');
const kvDatabase = require('./kv');
const Regisshow = require('./models/regisshows');
const Onboardshows = require('./models/onboardshows');
const Onboardlands = require('./models/onboardlands');
const Onboardlandnums = require('./models/onboardlandnums');
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
  "Access-Control-Allow-Origin": "*"
}));

// Initialize KV database
kvDatabase.initializeCollections().then(() => {
  console.log('KV Database initialized');
}).catch(err => {
  console.error('Failed to initialize KV database:', err);
});

// define routes and middleware
app.get('/', function (req, res) {
  res.send('Hello, World! - Now using Vercel KV');
});

app.get('/regisshow', async function(req, res) {
  try {
    const regisshows = await Regisshow.find({});
    if (regisshows.length === 0) {
      return res.status(404).send('No documents found in the collection');
    }
    console.log(regisshows);
    return res.send(regisshows);
  } catch (err) {
    console.error('Error fetching regisshows:', err);
    return res.status(500).send(err.message);
  }
});

app.get('/onboardshows', async function(req, res) {
  try {
    const onboardshows = await Onboardshows.find({});
    if (onboardshows.length === 0) {
      return res.status(404).send('No documents found in the collection');
    }
    console.log(onboardshows);
    return res.send(onboardshows);
  } catch (err) {
    console.error('Error fetching onboardshows:', err);
    return res.status(500).send(err.message);
  }
});

app.get('/onboardlands', async function(req, res) {
  try {
    const onboardlands = await Onboardlands.find({});
    if (onboardlands.length === 0) {
      return res.status(404).send('No documents found in the collection');
    }
    console.log(onboardlands);
    return res.send(onboardlands);
  } catch (err) {
    console.error('Error fetching onboardlands:', err);
    return res.status(500).send(err.message);
  }
});

app.get('/onboardlandnums', async function(req, res) {
  try {
    const onboardlandnums = await Onboardlandnums.findOne({});
    if (!onboardlandnums) {
      return res.status(404).send('No documents found in the collection');
    }
    console.log(onboardlandnums);
    return res.send(onboardlandnums);
  } catch (err) {
    console.error('Error fetching onboardlandnums:', err);
    return res.status(500).send(err.message);
  }
});

app.put('/regisshow', async function(req, res) {
  try {
    console.log('Request body:', req.body);
    const idshow = req.body['idshow'];
    
    const regisshow = await Regisshow.findOneAndUpdate(
      { idshow: idshow }, 
      { $inc: { numbershow: 1 } }, 
      { new: true }
    );
    
    if (!regisshow) {
      return res.status(404).send('Document not found');
    }
    return res.send(regisshow);
  } catch (err) {
    console.error('Error updating regisshow:', err);
    return res.status(500).send(err.message);
  }
});

app.put('/onboardshows', async function(req, res) {
  try {
    console.log('Request body:', req.body);
    const idshow = req.body['idshow'];
    
    const onboardshow = await Onboardshows.findOneAndUpdate(
      { idshow: idshow }, 
      { $inc: { numbershow: 1 } }, 
      { new: true }
    );
    
    if (!onboardshow) {
      return res.status(404).send('Document not found');
    }
    return res.send(onboardshow);
  } catch (err) {
    console.error('Error updating onboardshow:', err);
    return res.status(500).send(err.message);
  }
});

app.put('/onboardlands', async function(req, res) {
  try {
    console.log('Request body:', req.body);
    const idshow = req.body['idshow'];
    
    const onboardland = await Onboardlands.findOneAndUpdate(
      { idshow: idshow }, 
      { $inc: { numbershow: 1 } }, 
      { new: true }
    );
    
    if (!onboardland) {
      return res.status(404).send('Document not found');
    }
    return res.send(onboardland);
  } catch (err) {
    console.error('Error updating onboardland:', err);
    return res.status(500).send(err.message);
  }
});

app.put('/onboardshowsminus', async function(req, res) {
  try {
    console.log('Request body:', req.body);
    const idshow = req.body['idshow'];
    
    const onboardshow = await Onboardshows.findOneAndUpdate(
      { idshow: idshow }, 
      { $inc: { numbershow: -1 } }, 
      { new: true }
    );
    
    if (!onboardshow) {
      return res.status(404).send('Document not found');
    }
    return res.send(onboardshow);
  } catch (err) {
    console.error('Error updating onboardshow:', err);
    return res.status(500).send(err.message);
  }
});

app.put('/onboardlandnums', async function(req, res) {
  try {
    console.log('Request body:', req.body);
    const idshow = req.body['idshow'];
    
    const doc = await Onboardlandnums.findOneAndUpdate(
      {}, 
      { $inc: { numland: 1 } }, 
      { new: true }
    );
    
    if (!doc) {
      return res.status(500).send('Counter document not found');
    }

    await Onboardlands.findOneAndUpdate(
      { idshow: idshow }, 
      { $set: { numbershow: doc.numland } }, 
      { new: true }
    );
    
    res.status(200).json({ message: "updated successfully", numland: doc.numland });
  } catch (err) {
    console.error('Error updating onboardlandnums:', err);
    res.status(500).send(err.message);
  }
});

// start the server
const PORT = process.env.PORT || 50100;
app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`);
  console.log('Using Vercel KV Database');
});
