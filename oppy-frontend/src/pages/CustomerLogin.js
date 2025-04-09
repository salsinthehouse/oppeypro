import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CustomerLogin.css';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Prototype credentials
    if (email === 'sal@oppey.co.nz' && password === 'password') {
      localStorage.setItem('customerLoggedIn', 'true');
      navigate('/');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="customer-login">
      <h2>Customer Login</h2>
      <form onSubmit={handleLogin} className="customer-login__form">
        {error && <p className="customer-login__error">{error}</p>}
        <div className="customer-login__form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="customer-login__form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="customer-login__button">
          Login
        </button>
      </form>
      <p>
        New customer? <a href="/register/customer">Register here</a>
      </p>
    </div>
  );
};

export default CustomerLogin;
