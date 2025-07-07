const mongoose = require('mongoose');

const onboardlandnumsSchema = new mongoose.Schema({
  numland: {
    type: Number,
    required: true
  },

}, { timestamps: true });


module.exports = mongoose.model('Onboardlandnums', onboardlandnumsSchema);
