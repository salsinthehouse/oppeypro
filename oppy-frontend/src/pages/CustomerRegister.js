import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CustomerRegister.css';

const CustomerRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          userType: 'customer'
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration failed');
      setMessage('Customer registered. Please confirm your email.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="customer-register">
      <h2>Customer Registration</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Your Email"
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

export default CustomerRegister;
