import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterStore.css';

const RegisterStore = () => {
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState({
    storeName: '',
    description: '',
    location: '',
    email: '',
    phone: ''
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData({ ...storeData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate registration by logging data and saving to localStorage
    console.log('Store registration submitted:', storeData);
    localStorage.setItem('storeData', JSON.stringify(storeData));
    // Simulate sending an automated email (in a real app, you'd call an API)
    console.log(`Email sent to ${storeData.email} and management: Store registration submission received.`);
    setSubmitted(true);
    // Optionally, redirect after a delay:
    // setTimeout(() => navigate('/vendor'), 3000);
  };

  return (
    <div className="register-store">
      {submitted ? (
        <div className="register-store__confirmation">
          <h2>We will get back to you</h2>
          <p>Your store registration has been submitted. An email confirmation has been sent.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="register-store__form">
          <h2>Register Your Store</h2>
          <div className="register-store__form-group">
            <label>Store Name:</label>
            <input
              type="text"
              name="storeName"
              value={storeData.storeName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="register-store__form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={storeData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="register-store__form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={storeData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="register-store__form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={storeData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="register-store__form-group">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={storeData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="register-store__form-buttons">
            <button type="submit">Submit Registration</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterStore;
