// const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);
// mongoose.connect('mongodb+srv://teeramail:qvdrYkGpm6MLJx8H@cluster0.gk51ki6.mongodb.net/scoreboard', {useNewUrlParser: true});
// const stream = mongoose.connection.watch([
//   { $match: { "operationType": "update", "fullDocument.model": "Onboardlands","updateDescription.updatedFields.numbershow": { $exists: true } } }
// ]);
// module.exports = stream;


// const mongoose = require("mongoose");
// mongoose.set('strictQuery', false);
// mongoose.connect('mongodb://127.0.0.1:27017/scoreboard', {useNewUrlParser: true});
// const stream = mongoose.connection.watch([
//   { $match: { "operationType": "update", "fullDocument.model": "Onboardlands","updateDescription.updatedFields.numbershow": { $exists: true } } }
// ]);
// stream.on("change", (change) => {
//   console.log("Change detected on Onboardlands numbershow:", change);
// });
// module.exports = stream;


const mongoose = require("mongoose");

// disable strict query
mongoose.set('strictQuery', false);

// connect to the mongodb server
mongoose.connect('mongodb://127.0.0.1:27017/scoreboard', {useNewUrlParser: true});

if (mongoose.connection.readyState === 1) {
  console.log("Connected to MongoDB");
} else {
  console.log("Not connected to MongoDB");
}

const stream = mongoose.connection.watch([
  { $match: { "operationType": "update", "fullDocument.model": "Onboardlands","updateDescription.updatedFields.numbershow": { $exists: true } } }
]);

stream.on("change", (change) => {
  console.log("Change detected on Onboardlands numbershow:", change);
});

module.exports = stream;
