// File: src/pages/AdminLogin.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const baseUrl = process.env.REACT_APP_API_URL || window.location.origin;

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        `${baseUrl}/api/auth/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const token = res.data?.tokens?.AccessToken || res.data?.token;
      if (!token) throw new Error('No access token received.');

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminEmail', email);
      navigate('/admin');
    } catch (err) {
      console.error('Admin login error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.'
      );
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Admin Email"
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
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;
