import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CustomerRegister.css';

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate registration; in a real app, you'd call your registration API
    console.log('Registering customer with email:', email);
    localStorage.setItem('customerLoggedIn', 'true');
    navigate('/');
  };

  const handleSocialRegister = (provider) => {
    console.log(`Registering with ${provider}`);
    // Simulate social registration
    localStorage.setItem('customerLoggedIn', 'true');
    navigate('/');
  };

  return (
    <div className="customer-register">
      <h2>Customer Registration</h2>
      {error && <p className="customer-register__error">{error}</p>}
      <form onSubmit={handleRegister} className="customer-register__form">
        <div className="customer-register__form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="customer-register__form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="customer-register__button">
          Register
        </button>
      </form>
      <div className="customer-register__social">
        <p>Or register with:</p>
        <button
          onClick={() => handleSocialRegister('Facebook')}
          className="customer-register__social-button"
        >
          Facebook
        </button>
        <button
          onClick={() => handleSocialRegister('Google')}
          className="customer-register__social-button"
        >
          Google
        </button>
        <button
          onClick={() => handleSocialRegister('X')}
          className="customer-register__social-button"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default CustomerRegister;
