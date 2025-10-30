// backend/index.js - FIXED VERSION
require('dotenv').config();
const { encryptAESGCM, decryptAESGCM } = require('./crypto_aes_gcm');
const { issueToken, verifyToken } = require('./jwt_helper');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JsonRpcProvider, Wallet, Contract } = require('ethers');
const PDFDocument = require('pdfkit');
const qrcode = require('qrcode');
const { OAuth2Client } = require('google-auth-library');
const morgan = require('morgan'); // Add logging

const { sha256Hex, aesEncryptString, aesDecryptString } = require('./utils/crypto');

// ============= CONSTANTS =============
const JSON_SIZE_LIMIT = '3mb';
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60;
const DEFAULT_GAS_BUFFER_PERCENT = 20; // 20% buffer over estimate

// ============= APP SETUP =============
const app = express();

// DIAGNOSTIC - Add this RIGHT HERE
app.use((req, res, next) => {
  console.log('REQUEST RECEIVED:', req.method, req.path);
  next();
});

app.use(express.json({ limit: JSON_SIZE_LIMIT }));


// Middleware
app.use(express.json({ limit: JSON_SIZE_LIMIT }));
app.use(helmet());
app.use(cors({ origin: '*' })); // User requested to keep this as-is
app.use(rateLimit({ 
  windowMs: RATE_LIMIT_WINDOW_MS, 
  max: RATE_LIMIT_MAX_REQUESTS,
  message: { error: 'Too many requests, please try again later' }
}));
app.use(morgan('combined')); // Add request logging


// Temporary test route
app.get('/test', (req, res) => {
  res.json({ test: 'working' });
});


// ============= MONGODB SETUP =============
// FIXED: Removed deprecated options
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(e => { 
    console.error('MongoDB connection error:', e); 
    process.exit(1); 
  });

// ============= SCHEMAS =============
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  googleId: { type: String, default: null },
  name: String,
  picture: String,
  createdAt: { type: Date, default: Date.now }
});

// FIXED: Added blockchainRecordId field
const RecordSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  dataHash: String,
  txHash: String,
  txBlock: Number,
  blockchainRecordId: String, // NEW: Store the blockchain record ID
  encryptedData: String,
  createdAt: { type: Date, default: Date.now }
});

// Add index for faster lookups
RecordSchema.index({ dataHash: 1 });
RecordSchema.index({ userId: 1, createdAt: -1 });

const User = mongoose.model('User', UserSchema);
const Record = mongoose.model('Record', RecordSchema);

// ============= BLOCKCHAIN SETUP =============
// FIXED: Better error handling for blockchain connection
let provider, wallet, contract;

try {
  if (!process.env.INFURA_URL) throw new Error('INFURA_URL not set');
  if (!process.env.PRIVATE_KEY) throw new Error('PRIVATE_KEY not set');
  if (!process.env.CONTRACT_ADDRESS) throw new Error('CONTRACT_ADDRESS not set');

  provider = new JsonRpcProvider(process.env.INFURA_URL);
  wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  const contractABI = require('./utils/contractABI.json');
  contract = new Contract(
    process.env.CONTRACT_ADDRESS,
    contractABI,
    wallet
  );
  console.log('Blockchain connection initialized');
} catch (error) {
  console.error('CRITICAL: Blockchain setup failed:', error.message);
  console.error('Endpoints requiring blockchain will not work');
}

// ============= GOOGLE OAUTH SETUP =============
if (!process.env.GOOGLE_CLIENT_ID) {
  console.warn('WARNING: GOOGLE_CLIENT_ID not set - Google auth will not work');
}
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ============= MIDDLEWARE =============
// FIXED: Better error handling and standardized responses
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ 
      success: false, 
      error: 'No authorization header provided' 
    });
  }

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid authorization header format. Use: Bearer <token>' 
    });
  }

  const token = parts[1];
  try {
    const data = verifyToken(token);
    req.user = { id: data.sub, email: data.email };
    next();
  } catch (e) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
}

// FIXED: Input validation middleware
function validateExtractedData(req, res, next) {
  const { extractedData } = req.body;
  
  if (!extractedData) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing extractedData in request body' 
    });
  }

  if (typeof extractedData !== 'object') {
    return res.status(400).json({ 
      success: false, 
      error: 'extractedData must be an object' 
    });
  }

  if (Object.keys(extractedData).length === 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'extractedData cannot be empty' 
    });
  }

  next();
}

// ============= ROUTES =============

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DhanRakshak API',
    version: '1.0.0',
    endpoints: {
      public: [
        'GET /',
        'GET /health',
        'POST /auth/google',
        'POST /verify'
      ],
      authenticated: [
        'POST /submit',
        'GET /record/:id',
        'GET /records (with pagination)'
      ]
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  const health = {
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      blockchain: contract ? 'initialized' : 'not configured'
    }
  };
  res.json(health);
});

// Google authentication
app.post('/auth/google', async (req, res) => {
  try {
    const { id_token } = req.body;
    
    if (!id_token) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing id_token in request body' 
      });
    }

    if (!googleClient.clientId) {
      return res.status(503).json({ 
        success: false, 
        error: 'Google authentication not configured' 
      });
    }

    const ticket = await googleClient.verifyIdToken({ 
      idToken: id_token, 
      audience: process.env.GOOGLE_CLIENT_ID 
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, email_verified, name, picture } = payload;
    
    if (!email_verified) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email not verified by Google' 
      });
    }

    // Find or create user
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        user.name = user.name || name;
        user.picture = user.picture || picture;
        await user.save();
      } else {
        user = await User.create({ email, googleId, name, picture });
      }
    }

    const token = issueToken(user);
    
    res.json({ 
      success: true,
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name, 
        picture: user.picture 
      } 
    });

  } catch (e) {
    console.error('Google auth error:', e);
    res.status(401).json({ 
      success: false, 
      error: 'Invalid Google ID token or authentication failed' 
    });
  }
});

// FIXED: Submit endpoint with proper contract function and duplicate check
app.post('/submit', authMiddleware, validateExtractedData, async (req, res) => {
  try {
    const { extractedData } = req.body;

    if (!contract) {
      return res.status(503).json({ 
        success: false, 
        error: 'Blockchain service not available' 
      });
    }

    // 1) Hash for blockchain integrity
    const hash = sha256Hex(extractedData);

    // FIXED: Check for duplicate submission
    const existingRecord = await Record.findOne({ 
      userId: req.user.id, 
      dataHash: hash 
    });
    
    if (existingRecord) {
      return res.status(409).json({ 
        success: false, 
        error: 'This data has already been submitted',
        recordId: existingRecord._id,
        txHash: existingRecord.txHash
      });
    }

    // 2) FIXED: Use addRecord instead of storeRecord with gas estimation
    let tx, receipt;
    try {
      // Estimate gas and add buffer
      const gasEstimate = await contract.addRecord.estimateGas(hash);
      const gasLimit = (gasEstimate * BigInt(100 + DEFAULT_GAS_BUFFER_PERCENT)) / BigInt(100);
      
      tx = await contract.addRecord(hash, { gasLimit });
      receipt = await tx.wait();
      
      if (!receipt.status) {
        throw new Error('Transaction failed on blockchain');
      }
    } catch (blockchainError) {
      console.error('Blockchain transaction error:', blockchainError);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to store record on blockchain',
        details: blockchainError.message 
      });
    }

    // 3) FIXED: Get the blockchain record ID
    const recordCount = await contract.recordCount();
    const blockchainRecordId = recordCount.toString();

    // 4) Encrypt the data with AES-GCM
    const KEK_HEX = process.env.AES_KEK_HEX;
    if (!KEK_HEX) {
      throw new Error('AES_KEK_HEX not set in environment variables');
    }

    const encryptedData = encryptAESGCM(JSON.stringify(extractedData), KEK_HEX);

    // 5) FIXED: Save to MongoDB with blockchain record ID
    const dbRecord = await Record.create({
      userId: req.user.id,
      dataHash: hash,
      txHash: receipt.hash,
      txBlock: receipt.blockNumber,
      blockchainRecordId, // Store the blockchain ID
      encryptedData
    });

    // 6) FIXED: Generate PDF with better error handling
    const etherscanPrefix = process.env.ETHERSCAN_TX_PREFIX || 'https://etherscan.io/tx/';
    const txUrl = etherscanPrefix + receipt.hash;
    
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('error', (err) => {
      console.error('PDF generation error:', err);
      if (!res.headersSent) {
        res.status(500).json({ 
          success: false, 
          error: 'Failed to generate certificate PDF' 
        });
      }
    });
    
    doc.on('end', async () => {
      try {
        const pdfData = Buffer.concat(buffers);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=tax_integrity_certificate.pdf');
        res.setHeader('X-Record-Id', dbRecord._id.toString());
        res.setHeader('X-Transaction-Hash', receipt.hash);
        res.send(pdfData);
      } catch (err) {
        console.error('PDF send error:', err);
        if (!res.headersSent) {
          res.status(500).json({ 
            success: false, 
            error: 'Failed to send certificate PDF' 
          });
        }
      }
    });

    // Generate PDF content
    doc.fontSize(20).text('DhanRakshak', { align: 'center' });
    doc.fontSize(16).text('Tax Integrity Certificate', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Certificate ID: ${dbRecord._id}`, { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text('Verification Details:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`User ID: ${req.user.id}`);
    doc.text(`Data Hash (SHA-256): ${hash}`);
    doc.text(`Blockchain Record ID: ${blockchainRecordId}`);
    doc.text(`Transaction Hash: ${receipt.hash}`);
    doc.text(`Block Number: ${receipt.blockNumber}`);
    doc.text(`Timestamp: ${new Date().toISOString()}`);
    doc.moveDown();
    doc.text(`Blockchain Explorer: ${txUrl}`, { link: txUrl, underline: true });
    doc.moveDown();
    
    doc.fontSize(9).text(
      'This certificate verifies that your tax data has been cryptographically hashed ' +
      'and stored on the blockchain, ensuring its integrity and immutability.',
      { align: 'justify' }
    );
    doc.moveDown();

    // QR Code
    try {
      const qrData = await qrcode.toDataURL(txUrl);
      const base64Data = qrData.replace(/^data:image\/png;base64,/, '');
      const qrBuffer = Buffer.from(base64Data, 'base64');
      doc.image(qrBuffer, { fit: [120, 120], align: 'center' });
    } catch (qrError) {
      console.error('QR code generation error:', qrError);
      doc.text('(QR code generation failed)', { align: 'center' });
    }

    doc.end();

  } catch (e) {
    console.error('Submit endpoint error:', e);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during submission',
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
});

// FIXED: Verify endpoint - complete rewrite to work with contract structure
app.post('/verify', validateExtractedData, async (req, res) => {
  try {
    const { extractedData } = req.body;

    if (!contract) {
      return res.status(503).json({ 
        success: false, 
        error: 'Blockchain service not available' 
      });
    }

    // 1) Compute hash
    const hash = sha256Hex(extractedData);

    // 2) FIXED: Look up record in database first (since contract doesn't support hash lookup)
    const dbRecord = await Record.findOne({ dataHash: hash });

    if (!dbRecord || !dbRecord.blockchainRecordId) {
      return res.json({ 
        success: true,
        match: false, 
        reason: 'Data hash not found in database',
        dataHash: hash
      });
    }

    // 3) FIXED: Verify on blockchain using the record ID
    try {
      const blockchainRecord = await contract.getRecord(dbRecord.blockchainRecordId);
      const [storedHash, timestamp, owner] = blockchainRecord;

      // 4) Verify the hash matches
      if (storedHash !== hash) {
        return res.json({ 
          success: true,
          match: false, 
          reason: 'Hash mismatch between database and blockchain',
          databaseHash: hash,
          blockchainHash: storedHash
        });
      }

      // 5) Success - data is verified
      return res.json({ 
        success: true,
        match: true, 
        dataHash: hash,
        blockchainRecordId: dbRecord.blockchainRecordId,
        timestamp: timestamp.toString(), 
        submitter: owner,
        transactionHash: dbRecord.txHash,
        blockNumber: dbRecord.txBlock,
        verifiedAt: new Date().toISOString()
      });

    } catch (blockchainError) {
      console.error('Blockchain verification error:', blockchainError);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to verify on blockchain',
        details: blockchainError.message
      });
    }

  } catch (e) {
    console.error('Verify endpoint error:', e);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during verification',
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
});

// FIXED: Decrypt record with better error handling
app.get('/record/:id', authMiddleware, async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid record ID format' 
      });
    }

    const rec = await Record.findById(req.params.id);
    
    if (!rec) {
      return res.status(404).json({ 
        success: false, 
        error: 'Record not found' 
      });
    }

    // Authorization check
    if (rec.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'You do not have permission to access this record' 
      });
    }

    // Decrypt
    const KEK_HEX = process.env.AES_KEK_HEX;
    if (!KEK_HEX) {
      throw new Error('AES_KEK_HEX not configured');
    }

    let decrypted;
    try {
      decrypted = JSON.parse(decryptAESGCM(rec.encryptedData, KEK_HEX));
    } catch (decryptError) {
      console.error('Decryption error:', decryptError);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to decrypt record data' 
      });
    }

    res.json({
      success: true,
      record: decrypted,
      metadata: {
        id: rec._id,
        dataHash: rec.dataHash,
        txHash: rec.txHash,
        txBlock: rec.txBlock,
        blockchainRecordId: rec.blockchainRecordId,
        createdAt: rec.createdAt
      }
    });

  } catch (err) {
    console.error('Get record error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// NEW: Get all records for a user with pagination
app.get('/records', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid pagination parameters. Page must be ≥1, limit must be 1-100' 
      });
    }

    const records = await Record.find({ userId: req.user.id })
      .select('-encryptedData') // Don't return encrypted data in list
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Record.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    });

  } catch (err) {
    console.error('Get records error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// FIXED: 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    requestedPath: req.path,
    method: req.method
  });
});

// FIXED: Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============= START SERVER =============
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('='.repeat(50));
  console.log(`DhanRakshak Backend running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`Blockchain: ${contract ? 'Initialized' : 'Not configured'}`);
  console.log('='.repeat(50));
});