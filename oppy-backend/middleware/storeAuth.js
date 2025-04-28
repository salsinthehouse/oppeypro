const { CognitoIdentityServiceProvider } = require('aws-sdk');
const cognito = new CognitoIdentityServiceProvider();

const verifyVendorAccess = async (req, res, next) => {
  try {
    // Get the authorization token from the request header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token with Cognito
    const params = {
      AccessToken: token
    };

    const userData = await cognito.getUser(params).promise();
    
    // Extract vendor ID from user attributes
    const vendorId = userData.UserAttributes.find(
      attr => attr.Name === 'custom:vendorId'
    )?.Value;

    if (!vendorId) {
      return res.status(403).json({ error: 'User is not associated with any vendor' });
    }

    // Add vendor ID to request object for use in routes
    req.vendorId = vendorId;
    next();
  } catch (error) {
    console.error('Vendor authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = verifyVendorAccess; 