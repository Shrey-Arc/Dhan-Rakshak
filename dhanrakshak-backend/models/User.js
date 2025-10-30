const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  googleId: String,
  name: String,
  picture: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

