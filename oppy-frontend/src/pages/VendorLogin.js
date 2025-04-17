// File: src/pages/VendorLogin.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VendorLogin.css';

const VendorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const accessToken = data?.tokens?.AccessToken;
      if (!accessToken) {
        throw new Error('No access token received.');
      }

      localStorage.setItem('vendorAccessToken', accessToken);
      localStorage.setItem('vendorEmail', email);

      navigate('/vendor/dashboard');
    } catch (err) {
      console.error('Vendor login error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="vendor-login">
      <h2>Vendor Login</h2>
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
    </div>
  );
};

export default VendorLogin;
