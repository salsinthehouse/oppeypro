// File: src/pages/CustomerLogin.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CustomerLogin.css';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const COGNITO_DOMAIN = 'https://ap-southeast-2h3klci7kn.auth.ap-southeast-2.amazoncognito.com';
  const CLIENT_ID = '5jf5h16hat2fcju90p0r2tjd6k';
  const REDIRECT_URI = 'http://localhost:3000/login/customer';

  // OAuth Token Exchange (Google)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    const exchangeCodeForToken = async (authCode) => {
      try {
        const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            code: authCode,
            redirect_uri: REDIRECT_URI,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error_description || 'Failed to exchange token');
        }

        console.log('✅ OAuth token response:', data);

        localStorage.setItem('customerAccessToken', data.id_token);
        localStorage.setItem('customerRefreshToken', data.refresh_token);

        // Optional: decode ID token for user info
        // const decoded = JSON.parse(atob(data.id_token.split('.')[1]));
        // localStorage.setItem('customerEmail', decoded.email);

        navigate('/customer-dashboard');
      } catch (error) {
        console.error('❌ OAuth token exchange failed:', error);
        setError('Google login failed. Please try again.');
      }
    };

    if (code) {
      exchangeCodeForToken(code);
    }
  }, [navigate]);

  // Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('🔁 Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('customerAccessToken', data.tokens.IdToken);
      localStorage.setItem('customerEmail', email);

      navigate('/customer-dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  // Google Login via Hosted UI
  const handleGoogleLogin = () => {
    const scope = 'email openid profile';
    const loginUrl = `${COGNITO_DOMAIN}/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&identity_provider=Google`;

    window.location.href = loginUrl;
  };

  return (
    <div className="customer-login max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">🧍 Customer Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          className="input w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="input w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn-primary w-full">Login</button>
        {error && <p className="text-red-600">{error}</p>}
      </form>

      <hr className="my-6" />
      <button onClick={handleGoogleLogin} className="btn-secondary w-full">Continue with Google</button>
    </div>
  );
};

export default CustomerLogin;
