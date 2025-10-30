// backend/utils/crypto.js
const crypto = require('crypto');
const CryptoJS = require('crypto-js');

function sha256Hex(obj) {
  const json = JSON.stringify(obj);
  const hash = crypto.createHash('sha256').update(json).digest('hex');
  return '0x' + hash;
}

function aesEncryptString(plainString, key) {
  return CryptoJS.AES.encrypt(plainString, key).toString();
}

function aesDecryptString(cipherString, key) {
  const bytes = CryptoJS.AES.decrypt(cipherString, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { sha256Hex, aesEncryptString, aesDecryptString };
