const mongoose = require('mongoose');

const onboardsSchema = new mongoose.Schema({
  idshow: {
    type: Number,
    required: true
  },
  nameservice: {
    type: String,
    required: true
  },
  numbershow: {
    type: Number,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Onboardshows', onboardsSchema);
