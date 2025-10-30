const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  dataHash: String,       // Hash stored on blockchain
  txHash: String,         // Ethereum transaction hash
  encryptedData: String,  // Encrypted full record
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', recordSchema);
