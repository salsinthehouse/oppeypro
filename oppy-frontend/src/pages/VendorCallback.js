// File: src/pages/VendorCallback.js

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authConfig from '../config/auth';

const VendorCallback = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getToken = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          throw new Error('No authorization code found');
        }

        const body = new URLSearchParams();
        body.append('grant_type', 'authorization_code');
        body.append('client_id', authConfig.CLIENT_ID);
        body.append('code', code);
        body.append('redirect_uri', authConfig.REDIRECT_URI);

        const res = await fetch(`${authConfig.COGNITO_DOMAIN}/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: body
        });

        if (!res.ok) {
          throw new Error('Failed to get access token');
        }

        const data = await res.json();
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('idToken', data.id_token);
        
        navigate('/vendor/dashboard');
      } catch (err) {
        console.error('Auth error:', err);
        setError(err.message);
      }
    };

    getToken();
  }, [location, navigate]);

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Processing login...</h2>
    </div>
  );
};

export default VendorCallback;
