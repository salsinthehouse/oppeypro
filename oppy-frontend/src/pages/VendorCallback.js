// File: src/pages/VendorCallback.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VendorCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      
      if (error) {
        setError(`Login failed: ${error}`);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        return;
      }

      const clientId = '5jf5h16hat2fcju90p0r2tjd6k';
      const redirectUri = `${window.location.origin}/vendor/callback`;
      const domain = 'https://ap-southeast-2h3klci7kn.auth.ap-southeast-2.amazoncognito.com';

      const body = new URLSearchParams();
      body.append('grant_type', 'authorization_code');
      body.append('client_id', clientId);
      body.append('code', code);
      body.append('redirect_uri', redirectUri);

      try {
        console.log('Exchanging code for token...');
        const res = await fetch(`${domain}/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: body.toString()
        });

        const data = await res.json();
        console.log('Token response:', data);

        if (!res.ok) {
          throw new Error(data.error_description || 'Failed to exchange code');
        }

        if (!data.id_token) {
          throw new Error('No ID token received');
        }

        // Store both token names to ensure compatibility
        localStorage.setItem('vendorToken', data.id_token);
        localStorage.setItem('vendorAccessToken', data.id_token);
        console.log('Tokens stored, redirecting to dashboard...');
        navigate('/vendor/dashboard');
      } catch (err) {
        console.error('Token exchange failed:', err);
        setError(err.message);
        const redirectToLogin = () => navigate('/vendor/auth');
        setTimeout(redirectToLogin, 3000);
      }
    };

    getToken();
  }, [navigate]);

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Error</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <p>Redirecting to login page...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Processing Login</h2>
      <p>Please wait while we complete your login...</p>
    </div>
  );
};

export default VendorCallback;
