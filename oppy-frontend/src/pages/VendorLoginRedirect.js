import React, { useEffect } from 'react';

const VendorLoginRedirect = () => {
  useEffect(() => {
    const domain = 'https://ap-southeast-2h3klci7kn.auth.ap-southeast-2.amazoncognito.com';
    const clientId = '5jf5h16hat2fcju90p0r2tjd6k';
    const redirectUri = 'https://oppy.co.nz/vendor/callback';

    const loginUrl = `${domain}/login?client_id=${clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.location.href = loginUrl;
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Redirecting to secure vendor login...</p>
    </div>
  );
};

export default VendorLoginRedirect;
