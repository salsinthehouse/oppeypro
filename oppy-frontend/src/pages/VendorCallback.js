// File: src/pages/VendorCallback.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VendorCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (!code) return;

      const clientId = '5jf5h16hat2fcju90p0r2tjd6k';
      const redirectUri = 'https://oppy.co.nz/vendor/callback';
      const domain = 'https://ap-southeast-2h3klci7kn.auth.ap-southeast-2.amazoncognito.com';

      const body = new URLSearchParams();
      body.append('grant_type', 'authorization_code');
      body.append('client_id', clientId);
      body.append('code', code);
      body.append('redirect_uri', redirectUri);

      try {
        const res = await fetch(`${domain}/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: body.toString()
        });

        const data = await res.json();
        if (!data.id_token) throw new Error('Failed to exchange code');

        localStorage.setItem('vendorToken', data.id_token);
        navigate('/vendor/dashboard');
      } catch (err) {
        console.error('Token exchange failed:', err);
      }
    };

    getToken();
  }, [navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Processing login...</p>
    </div>
  );
};

export default VendorCallback;
