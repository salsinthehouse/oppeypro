const express = require('express');
const router = express.Router();

const {
  ListUsersCommand,
  AdminListGroupsForUserCommand,
  AdminAddUserToGroupCommand
} = require('@aws-sdk/client-cognito-identity-provider');

const verifyToken = require('../middleware/verifyToken');
const Vendor = require('../models/Vendor'); // ✅ MongoDB model

// ✅ Cognito client
const cognito = new (require('@aws-sdk/client-cognito-identity-provider')).CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION
});

// ✅ Helper to get user groups
const getUserGroups = async (username) => {
  const groupCommand = new AdminListGroupsForUserCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username
  });

  const groupResult = await cognito.send(groupCommand);
  return groupResult.Groups.map(g => g.GroupName);
};

// ✅ GET /api/admin/vendors/pending → list unapproved Cognito users
router.get('/vendors/pending', verifyToken(['admin']), async (req, res) => {
  try {
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID
    });

    const response = await cognito.send(listUsersCommand);
    const allUsers = response.Users;

    const pendingVendors = [];

    for (let user of allUsers) {
      const username = user.Username;
      const email = user.Attributes.find(attr => attr.Name === 'email')?.Value;
      const groups = await getUserGroups(username);

      if (!groups.includes('vendors') && !groups.includes('customers')) {
        pendingVendors.push({
          email,
          username,
          signupDate: user.UserCreateDate
        });
      }
    }

    res.json(pendingVendors);
  } catch (err) {
    console.error('❌ Error listing pending vendors:', err);
    res.status(500).json({ message: 'Failed to list pending vendors', error: err.message });
  }
});

// ✅ POST /api/admin/vendors/approve → approve vendor by email or username
router.post('/vendors/approve', verifyToken(['admin']), async (req, res) => {
  const { username, email } = req.body;

  if (!username && !email) {
    return res.status(400).json({ message: 'Username or email is required' });
  }

  try {
    let targetUsername = username;
    let user;

    // If email is given, find the matching Cognito user
    if (!targetUsername && email) {
      const listUsersCommand = new ListUsersCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Filter: `email = \"${email}\"`
      });

      const response = await cognito.send(listUsersCommand);
      user = response.Users?.[0];

      if (!user) {
        return res.status(404).json({ message: `No user found with email ${email}` });
      }

      targetUsername = user.Username;
    }

    // ✅ Add to Cognito group
    const command = new AdminAddUserToGroupCommand({
      GroupName: 'vendors',
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: targetUsername
    });
    await cognito.send(command);

    // ✅ Save to MongoDB
    let emailToSave = email;
    if (!emailToSave && user) {
      emailToSave = user.Attributes.find(attr => attr.Name === 'email')?.Value;
    }

    await Vendor.create({
      email: emailToSave,
      cognitoId: targetUsername
    });

    res.json({ message: `Vendor ${targetUsername} approved and saved successfully.` });
  } catch (err) {
    console.error('❌ Error approving vendor:', err);
    res.status(500).json({ message: 'Failed to approve vendor', error: err.message });
  }
});

module.exports = router;
