const mongoose = require('mongoose');

const EmissionsSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  co2TailpipeGpm: {
    type: Number,
    required: true,
  },
  UHighway: {
    type: Number,
    required: true,
  },
});

module.exports = EmissionsSchema;
