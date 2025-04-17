// File: routes/auth.js

const express = require('express');
const router = express.Router();

const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  InitiateAuthCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  AdminAddUserToGroupCommand
} = require('@aws-sdk/client-cognito-identity-provider');

// Debug .env
console.log('COGNITO_CLIENT_ID:', process.env.COGNITO_CLIENT_ID);
console.log('COGNITO_REGION:', process.env.COGNITO_REGION);
console.log('COGNITO_USER_POOL_ID:', process.env.COGNITO_USER_POOL_ID);

// Initialize Cognito client
const cognito = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION
});

//
// ✅ REGISTER (Vendor or Customer)
//
router.post('/register', async (req, res) => {
  const { email, password, userType } = req.body;

  if (!['vendor', 'customer'].includes(userType)) {
    return res.status(400).json({ message: 'userType must be "vendor" or "customer"' });
  }

  try {
    const signupCommand = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: 'email', Value: email }]
    });

    const signupResponse = await cognito.send(signupCommand);

    if (userType === 'customer') {
      const groupCommand = new AdminAddUserToGroupCommand({
        GroupName: 'customers',
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email
      });

      await cognito.send(groupCommand);
    }

    res.json({
      message:
        userType === 'vendor'
          ? 'Vendor registration successful. Awaiting approval.'
          : 'Customer registration successful. Added to customer group.',
      data: signupResponse
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
});

//
// ✅ CONFIRM SIGNUP
//
router.post('/confirm', async (req, res) => {
  const { email, code } = req.body;

  const command = new ConfirmSignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code
  });

  try {
    const response = await cognito.send(command);
    res.json({ message: 'Account confirmed successfully.', data: response });
  } catch (error) {
    console.error('Confirm error:', error);
    res.status(400).json({ message: 'Confirmation failed', error: error.message });
  }
});

//
// ✅ RESEND CONFIRMATION CODE
//
router.post('/resend', async (req, res) => {
  const { email } = req.body;

  const command = new ResendConfirmationCodeCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email
  });

  try {
    const response = await cognito.send(command);
    res.json({ message: 'Confirmation code resent.', data: response });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(400).json({ message: 'Could not resend code', error: error.message });
  }
});

//
// ✅ LOGIN
//
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  });

  try {
    const response = await cognito.send(command);

    const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;

    res.json({
      message: 'Login successful',
      tokens: {
        IdToken,        // ✅ Use this in Authorization: Bearer <IdToken>
        AccessToken,
        RefreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: 'Login failed', error: error.message });
  }
});

//
// ✅ FORGOT PASSWORD
//
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const command = new ForgotPasswordCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email
  });

  try {
    const response = await cognito.send(command);
    res.json({ message: 'Password reset code sent to email.', data: response });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(400).json({ message: 'Failed to initiate password reset', error: error.message });
  }
});

//
// ✅ CONFIRM FORGOT PASSWORD
//
router.post('/confirm-forgot-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  const command = new ConfirmForgotPasswordCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword
  });

  try {
    const response = await cognito.send(command);
    res.json({ message: 'Password reset successful.', data: response });
  } catch (error) {
    console.error('Reset confirm error:', error);
    res.status(400).json({ message: 'Failed to reset password', error: error.message });
  }
});

module.exports = router;
