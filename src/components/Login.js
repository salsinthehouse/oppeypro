// src/components/Login.js

import React, { useState } from 'react';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role is 'customer'

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/api/auth/login/${role}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          console.log('Login successful:', data);
        } else {
          console.error('Login failed:', data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="login-container">
      <h2>Login to Oppey</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Role:
          <select onChange={(e) => setRole(e.target.value)} value={role}>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
