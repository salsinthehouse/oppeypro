// File: controllers/authController.js

const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.COGNITO_REGION
});

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  };

  try {
    const response = await cognito.initiateAuth(params).promise();

    const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;

    return res.status(200).json({
      tokens: {
        IdToken,         // ✅ for backend auth
        AccessToken,     // optional for AWS service auth
        RefreshToken     // optional for session renewal
      }
    });
  } catch (err) {
    console.error('❌ Cognito login error:', err.message);
    return res.status(401).json({ message: 'Login failed: ' + err.message });
  }
};

module.exports = { loginUser };
