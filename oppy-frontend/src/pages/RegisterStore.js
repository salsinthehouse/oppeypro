import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterStore.css';

const RegisterStore = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          userType: 'vendor'
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration failed');
      setMessage(data.message || 'Registration successful. Please confirm your email.');

      // Optional: Save email to localStorage if needed
      // localStorage.setItem('pendingVendorEmail', email);
      // navigate('/confirm');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-store">
      <h2>Register Your Store</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Store Name (optional)"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Store Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default RegisterStore;
