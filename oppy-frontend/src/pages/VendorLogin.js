// File: src/pages/VendorLoginRedirect.js

import React, { useEffect } from 'react';

const VendorLoginRedirect = () => {
  useEffect(() => {
    // ✅ Replace the placeholders below with your actual values
    const COGNITO_DOMAIN = 'https://oppy.auth.ap-southeast-2.amazoncognito.com';
    const CLIENT_ID = '5jf5h16hat2fcju90p0r2tjd6k';
    const REDIRECT_URI = 'http://localhost:3000/vendor/callback'; // Make sure this matches your Cognito App Client callback URL

    const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

    window.location.href = loginUrl;
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Redirecting to secure vendor login...</p>
    </div>
  );
};

export default VendorLoginRedirect;
