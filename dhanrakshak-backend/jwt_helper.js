const jwt = require('jsonwebtoken');

const JWT_SECRET_B64 = process.env.JWT_SECRET_B64;
if (!JWT_SECRET_B64) throw new Error('JWT_SECRET_B64 missing in env');
const JWT_SECRET = Buffer.from(JWT_SECRET_B64, 'base64');

function issueToken(user) {
  const payload = { sub: user.id, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
}

module.exports = { issueToken, verifyToken };
