const mongoose = require('mongoose');

const onboardlandsSchema = new mongoose.Schema({
  idshow: {
    type: Number,
    required: true
  },

  numbershow: {
    type: Number,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Onboardlands', onboardlandsSchema);
