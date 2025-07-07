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

// Data viewer endpoint for web browser
app.get('/view-all-data', async function(req, res) {
  try {
    const collections = ['regisshows', 'onboardshows', 'onboardlands', 'onboardlandnums'];
    const allData = {};
    
    // Get all data from each collection
    for (const collection of collections) {
      allData[collection] = await kvDatabase.findAll(collection);
    }
    
    // Get all keys
    const { kv } = require('@vercel/kv');
    const allKeys = await kv.keys('*');
    
    const htmlResponse = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Vercel KV Database Viewer</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            h1 { color: #333; text-align: center; }
            h2 { color: #0070f3; border-bottom: 2px solid #0070f3; padding-bottom: 5px; }
            .collection { margin: 20px 0; }
            .item { background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #0070f3; }
            .key { font-weight: bold; color: #333; }
            .data { margin-top: 10px; }
            pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
            .summary { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .keys-list { columns: 3; column-gap: 20px; }
            .keys-list li { break-inside: avoid; margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🗄️ Vercel KV Database Viewer</h1>
            
            <div class="summary">
                <h3>📊 Database Summary</h3>
                <p><strong>Total Keys:</strong> ${allKeys.length}</p>
                <p><strong>Collections:</strong> ${collections.join(', ')}</p>
                <p><strong>Last Updated:</strong> ${new Date().toLocaleString()}</p>
            </div>

            ${Object.entries(allData).map(([collection, data]) => `
                <div class="collection">
                    <h2>📋 ${collection.toUpperCase()} (${data.length} items)</h2>
                    ${data.length === 0 ? '<p><em>No data found</em></p>' : 
                      data.map((item, index) => `
                        <div class="item">
                            <div class="key">🔑 Key: ${item._key}</div>
                            <div class="data">
                                <pre>${JSON.stringify(Object.fromEntries(Object.entries(item).filter(([k]) => k !== '_key')), null, 2)}</pre>
                            </div>
                        </div>
                      `).join('')
                    }
                </div>
            `).join('')}
            
            <div class="collection">
                <h2>🔑 All Keys in Database</h2>
                <ul class="keys-list">
                    ${allKeys.map(key => `<li>${key}</li>`).join('')}
                </ul>
            </div>
        </div>
    </body>
    </html>`;
    
    res.send(htmlResponse);
  } catch (err) {
    console.error('Error viewing all data:', err);
    res.status(500).send(`Error: ${err.message}`);
  }
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
