const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  scannedAmount: {
    type: Number,
    default: 0,
  }
});

const UserModel = mongoose.model('User', userSchema, 'users');

module.exports = UserModel;
