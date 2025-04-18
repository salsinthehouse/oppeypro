// File: src/pages/SubscribePage.js
import React from 'react';
import axios from 'axios';

const SubscribePage = () => {
  const handleSubscribe = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/subscribe`);
      window.location.href = res.data.url; // Redirect to Stripe Checkout
    } catch (err) {
      console.error('Subscription error:', err.message);
      alert('Something went wrong starting your subscription.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Subscribe to Unlock All Item Locations</h2>
      <p>$2/month • Cancel anytime</p>
      <button
        onClick={handleSubscribe}
        style={{
          padding: '1rem 2rem',
          fontSize: '16px',
          backgroundColor: '#ffa24d',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Subscribe Now
      </button>
    </div>
  );
};

export default SubscribePage;
