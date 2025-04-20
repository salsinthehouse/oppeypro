import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerAuth = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE;

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [error, setError] = useState('');
  const [registerMsg, setRegisterMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email: loginEmail,
        password: loginPassword
      });

      const token = res.data?.tokens?.AccessToken;
      if (!token) throw new Error('No token received');

      localStorage.setItem('customerAccessToken', token);
      localStorage.setItem('customerEmail', loginEmail);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (msg.includes('confirm')) {
        setError('Please confirm your email before logging in.');
      } else {
        setError(msg);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterMsg('');
    setError('');

    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, {
        email: registerEmail,
        password: registerPassword,
        userType: 'customer'
      });

      setRegisterMsg('✅ Registration successful. Please confirm your email.');
      setRegisterEmail('');
      setRegisterPassword('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', padding: '2rem', flexWrap: 'wrap' }}>
      {/* Login */}
      <div style={{ width: '300px' }}>
        <h2>Customer Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
          <button type="submit" style={{ width: '100%' }}>Log In</button>
        </form>
      </div>

      {/* Register */}
      <div style={{ width: '300px' }}>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input type="email" placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required />
          <button type="submit" style={{ width: '100%' }}>Register</button>
        </form>
        {registerMsg && <p style={{ color: 'green' }}>{registerMsg}</p>}
      </div>

      {error && <p style={{ color: 'red', width: '100%' }}>{error}</p>}
    </div>
  );
};

export default CustomerAuth;
