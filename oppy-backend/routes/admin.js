// File: routes/admin.js

const express = require('express');
const router = express.Router();
const {
  ListUsersCommand,
  AdminListGroupsForUserCommand,
  AdminAddUserToGroupCommand
} = require('@aws-sdk/client-cognito-identity-provider');

const verifyToken = require('../middleware/verifyToken');

const cognito = new (require('@aws-sdk/client-cognito-identity-provider')).CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION
});

// List users not in any group (pending vendor accounts)
router.get('/pending-vendors', verifyToken(['admin']), async (req, res) => {
  try {
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID
    });

    const response = await cognito.send(listUsersCommand);
    const allUsers = response.Users;

    const pendingVendors = [];

    for (let user of allUsers) {
      const groupCommand = new AdminListGroupsForUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: user.Username
      });

      const groupResult = await cognito.send(groupCommand);
      const groups = groupResult.Groups.map(g => g.GroupName);

      if (!groups.includes('vendors') && !groups.includes('customers')) {
        pendingVendors.push({
          email: user.Attributes.find(attr => attr.Name === 'email')?.Value,
          username: user.Username
        });
      }
    }

    res.json({ pendingVendors });
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ message: 'Failed to list users', error: err.message });
  }
});

// Approve vendor
router.post('/approve-vendor', verifyToken(['admin']), async (req, res) => {
  const { email } = req.body;

  try {
    const command = new AdminAddUserToGroupCommand({
      GroupName: 'vendors',
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email
    });

    await cognito.send(command);
    res.json({ message: `Vendor ${email} approved successfully.` });
  } catch (err) {
    console.error('Approve error:', err);
    res.status(400).json({ message: 'Approval failed', error: err.message });
  }
});

module.exports = router;
