// File: src/pages/CustomerDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CustomerDashboard.css';

const CustomerDashboard = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [quadrant, setQuadrant] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Get the correct token name that matches CustomerLogin.js
  const token = localStorage.getItem('customerAccessToken');

  useEffect(() => {
    // Redirect to login if no token
    if (!token) {
      navigate('/login/customer');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [itemsRes, subRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/items`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/check-sub`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setItems(itemsRes.data);
        setSubscribed(subRes.data.subscribed);
      } catch (err) {
        console.error('❌ Error fetching customer data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        if (err.response?.status === 401) {
          localStorage.removeItem('customerAccessToken');
          navigate('/login/customer');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleHold = async (itemId) => {
    const confirm = window.confirm('Hold this item for 24 hours?');
    if (!confirm) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/cart/hold/${itemId}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Item held for 24 hours');
      setItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, heldBy: 'you', holdExpiresAt: Date.now() + 86400000 } : item
        )
      );
    } catch (err) {
      console.error('❌ Failed to hold item:', err);
      alert(err.response?.data?.message || 'Error holding item');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesQuadrant = !quadrant || item.location?.toLowerCase().includes(quadrant.toLowerCase());
    return matchesSearch && matchesQuadrant && item.active;
  });

  if (loading) {
    return (
      <div className="customer-dashboard">
        <div className="loading-state">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-dashboard">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="hold-button" onClick={() => navigate('/login/customer')}>
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h2>Welcome to Oppy</h2>
        <p className="dashboard-subtitle">Browse and hold items from local vendors</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={quadrant}
          onChange={(e) => setQuadrant(e.target.value)}
        >
          <option value="">Filter by Quadrant</option>
          <option value="north">North</option>
          <option value="south">South</option>
          <option value="east">East</option>
          <option value="west">West</option>
          <option value="central">Central</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <div className="loading-state">
          <p>No items found.</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item) => (
            <div key={item._id} className="item-card">
              {item.images?.length > 0 && (
                <div className="item-image">
                  <img src={item.images[0]} alt={item.name} />
                </div>
              )}
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <p className="item-price">${item.price.toFixed(2)}</p>
                <p className="item-location">
                  {subscribed ? (
                    <span>📍 {item.location}</span>
                  ) : (
                    <span>🔒 Location locked (Subscribe to view)</span>
                  )}
                </p>
                <button
                  className="hold-button"
                  onClick={() => handleHold(item._id)}
                  disabled={item.heldBy === 'you'}
                >
                  {item.heldBy === 'you' ? 'Held for 24h' : 'Hold for 24h'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
