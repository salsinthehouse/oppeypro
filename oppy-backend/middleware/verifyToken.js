// File: middleware/verifyToken.js

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Create JWKS client from Cognito User Pool
const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
});

// Helper to get public signing key
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('❌ Error getting signing key:', err);
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Middleware to verify JWT token and check optional groups
function verifyToken(requiredGroups = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        console.error('❌ Token verification failed:', err.message);
        return res.status(403).json({ message: 'Token verification failed' });
      }

      // Debugging
      console.log('✅ Decoded token:', decoded);

      const userGroups = decoded['cognito:groups'] || [];

      // Check for group access
      if (requiredGroups.length > 0 && !requiredGroups.some(group => userGroups.includes(group))) {
        return res.status(403).json({ message: 'Access denied. Insufficient group permissions.' });
      }

      req.user = decoded;
      next();
    });
  };
}

module.exports = verifyToken;
