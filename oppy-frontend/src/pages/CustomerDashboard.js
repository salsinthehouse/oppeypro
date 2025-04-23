// File: src/pages/CustomerDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerDashboard = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [quadrant, setQuadrant] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const token = localStorage.getItem('customerIdToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, subRes] = await Promise.all([
          axios.get('/api/items'),
          axios.get('/api/auth/check-sub', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setItems(itemsRes.data);
        setSubscribed(subRes.data.subscribed);
      } catch (err) {
        console.error('❌ Error fetching customer data:', err);
      }
    };

    fetchData();
  }, [token]);

  const handleHold = async (itemId) => {
    const confirm = window.confirm('Hold this item for 24 hours?');
    if (!confirm) return;

    try {
      const res = await axios.post(`/api/cart/hold/${itemId}`, null, {
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
      alert('Error holding item');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesQuadrant = !quadrant || item.location?.toLowerCase().includes(quadrant.toLowerCase());
    return matchesSearch && matchesQuadrant && item.active;
  });

  return (
    <div className="customer-dashboard" style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '1rem' }}>🧍 Welcome to Oppy</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
        />

        <select value={quadrant} onChange={(e) => setQuadrant(e.target.value)} style={{ padding: '0.5rem', width: '100%' }}>
          <option value="">Filter by Quadrant</option>
          <option value="north">North</option>
          <option value="south">South</option>
          <option value="east">East</option>
          <option value="west">West</option>
          <option value="central">Central</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div>
          {filteredItems.map((item) => (
            <div key={item._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
              {subscribed ? (
                <p><strong>Location:</strong> {item.location}</p>
              ) : (
                <p><strong>Location:</strong> 🔒 Unlock with subscription</p>
              )}
              {item.images?.length > 0 && (
                <img src={item.images[0]} alt={item.name} width="150" style={{ marginTop: '0.5rem' }} />
              )}
              <button onClick={() => handleHold(item._id)} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
                Hold for 24h
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
