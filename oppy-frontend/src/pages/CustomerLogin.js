import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CustomerLogin.css';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle Google OAuth redirect and token exchange
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    const exchangeCodeForToken = async (authCode) => {
      try {
        const response = await fetch(
          'https://ap-southeast-2h3klci7kn.auth.ap-southeast-2.amazoncognito.com/oauth2/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: '5jf5h16hat2fcju90p0r2tjd6k',
              code: authCode,
              redirect_uri: 'http://localhost:3000/login/customer',
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error_description || 'Failed to exchange token');
        }

        console.log('✅ OAuth token response:', data);

        // ✅ Save only ID token to authenticate with backend
        localStorage.setItem('customerAccessToken', data.id_token);
        localStorage.setItem('customerRefreshToken', data.refresh_token); // optional

        // Optional: decode token here if you want to store user email/name
        // const decoded = JSON.parse(atob(data.id_token.split('.')[1]));
        // localStorage.setItem('customerEmail', decoded.email);

        navigate('/');
      } catch (error) {
        console.error('❌ OAuth token exchange failed:', error);
        setError('Google login failed. Please try again.');
      }
    };

    if (code) {
      exchangeCodeForToken(code);
    }
  }, [navigate]);

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('🔁 Login response:', data); // ⬅️ Add this line
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // ✅ Save token (manual login path uses Cognito AccessToken)
        localStorage.setItem('customerAccessToken', data.tokens.IdToken); // or AccessToken
        localStorage.setItem('customerEmail', email);

        navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  // Trigger Hosted UI for Google login
  const handleGoogleLogin = () => {
    const baseUrl = 'https://ap-southeast-2h3klci7kn.auth.ap-southeast-2.amazoncognito.com';
    const clientId = '5jf5h16hat2fcju90p0r2tjd6k';
    const redirectUri = 'http://localhost:3000/login/customer';
    const scope = 'email openid profile';

    const loginUrl = `${baseUrl}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&identity_provider=Google`;

    window.location.href = loginUrl;
  };

  return (
    <div className="customer-login">
      <h2>Customer Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>

      <hr />
      <button onClick={handleGoogleLogin}>Continue with Google</button>
    </div>
  );
};

export default CustomerLogin;
