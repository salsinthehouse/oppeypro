import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VendorLogin.css';

const VendorLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Prototype credentials: Email: shop1@oppey.co.nz, Password: password
    if (email === 'shop1@oppey.co.nz' && password === 'password') {
      localStorage.setItem('vendorLoggedIn', 'true');
      localStorage.setItem('vendorStoreName', 'Shop1');
      navigate('/vendor');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="vendor-login">
      <h2>Vendor Login</h2>
      {error && <p className="vendor-login__error">{error}</p>}
      <form onSubmit={handleLogin} className="vendor-login__form">
        <div className="vendor-login__form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="vendor-login__form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="vendor-login__button">
          Login
        </button>
      </form>
    </div>
  );
};

export default VendorLogin;
