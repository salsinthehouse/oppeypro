import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VendorAuth = () => {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [registerMsg, setRegisterMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/vendors/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (!data.token) throw new Error('No access token received');

      localStorage.setItem('vendorToken', data.token);
      localStorage.setItem('vendorEmail', loginEmail);

      navigate('/vendor/dashboard');
    } catch (err) {
      const msg = err.message;
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          storeName,
          description,
          userType: 'vendor' // ✅ required by backend
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setRegisterMsg('✅ Store registered! Please confirm your email and wait for admin approval.');
      setRegisterEmail('');
      setRegisterPassword('');
      setStoreName('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      padding: '2rem',
      flexWrap: 'wrap'
    }}>
      {/* Login Form */}
      <div style={{ width: '300px' }}>
        <h2>Vendor Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <button type="submit" style={{ width: '100%' }}>Log In</button>
        </form>
      </div>

      {/* Register Form */}
      <div style={{ width: '300px' }}>
        <h2>Register Your Store</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Store Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <textarea
            placeholder="Brief Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <button type="submit" style={{ width: '100%' }}>Register Store</button>
        </form>
        {registerMsg && <p style={{ color: 'green' }}>{registerMsg}</p>}
      </div>

      {/* Shared Error Display */}
      {error && <p style={{ color: 'red', marginTop: '1rem', width: '100%' }}>{error}</p>}
    </div>
  );
};

export default VendorAuth;
