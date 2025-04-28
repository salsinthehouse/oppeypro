// File: src/pages/VendorLogin.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import authConfig from '../config/auth';
import { Button, Container, Typography } from '@mui/material';

const VendorLogin = () => {
  const navigate = useNavigate();
  
  // Construct the login URL with all required parameters
  const loginUrl = new URL(`${authConfig.COGNITO_DOMAIN}/oauth2/authorize`);
  loginUrl.searchParams.append('client_id', authConfig.CLIENT_ID);
  loginUrl.searchParams.append('response_type', authConfig.RESPONSE_TYPE);
  loginUrl.searchParams.append('scope', authConfig.SCOPE);
  loginUrl.searchParams.append('redirect_uri', authConfig.CALLBACK_URI);
  loginUrl.searchParams.append('state', authConfig.STATE);

  const handleDevLogin = () => {
    // For development only - simulate a successful login
    localStorage.setItem('accessToken', 'dev-token');
    localStorage.setItem('idToken', 'dev-id-token');
    localStorage.setItem('userType', 'vendor');
    navigate('/vendor/dashboard');
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>Vendor Login</Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => window.location.href = loginUrl.toString()}
        style={{ marginBottom: '1rem' }}
        fullWidth
      >
        Login with Cognito
      </Button>

      {process.env.NODE_ENV === 'development' && (
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={handleDevLogin}
          fullWidth
        >
          Development Login (Skip Cognito)
        </Button>
      )}
    </Container>
  );
};

export default VendorLogin;
