import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubscribePage = () => {
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    const token = localStorage.getItem('customerToken');

    if (!token) {
      const confirm = window.confirm('You must be logged in as a customer to subscribe. Go to login?');
      if (confirm) {
        navigate('/login/customer'); // ✅ Change this if your login route is different
      }
      return;
    }

    try {
      const res = await axios.post(
        '/api/subscribe',
        { tier: 2 },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.url) {
        window.location.href = res.data.url; // ✅ This is where Stripe should take over
      } else {
        console.error('No checkout URL returned.');
        alert('Subscription failed.');
      }
    } catch (err) {
      console.error('❌ Subscription error:', err.message);
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
