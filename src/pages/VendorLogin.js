import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VendorLogin = () => {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check credentials: we require storeName "Shop1" and password "password"
    if (storeName === "Shop1" && password === "password") {
      localStorage.setItem('vendorLoggedIn', 'true');
      localStorage.setItem('vendorStoreName', storeName);
      navigate('/vendor');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Vendor Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '1rem' }}>
          <label>Store Name:</label><br />
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ffa24d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default VendorLogin;
