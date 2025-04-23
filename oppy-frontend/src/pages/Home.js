import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from '../components/ItemCard';
import RevealStatus from '../components/RevealStatus';
import Navbar from '../components/Navbar';
import '../styles/Home.css';

const availableQuadrants = ['Central', 'North', 'South', 'East', 'West'];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuadrants, setSelectedQuadrants] = useState([]);
  const [vendorItems, setVendorItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/items`);
        setVendorItems(response.data);
      } catch (error) {
        console.error('❌ Failed to fetch items:', error);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = vendorItems.filter(item => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(lowerSearch) ||
      item.description.toLowerCase().includes(lowerSearch);
    const matchesQuadrant =
      selectedQuadrants.length === 0 || selectedQuadrants.includes(item.quadrant);
    return (!item.status || item.status === 'active') && matchesSearch && matchesQuadrant;
  });

  const handleUnlock = (item) => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (!cartItems.find(i => i.id === item.id)) {
      const unlockedItem = { ...item, unlocked: true };
      cartItems.push(unlockedItem);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`"${item.name}" unlocked and added to your cart.`);
    } else {
      alert("This item has already been unlocked.");
    }
  };

  const handleQuadrantChange = (e) => {
    const { value, checked } = e.target;
    setSelectedQuadrants(prev =>
      checked ? [...prev, value] : prev.filter(q => q !== value)
    );
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem('customerToken');
    console.log('📦 customerToken:', token); // ✅ Debug log

    if (!token) {
      const confirm = window.confirm('You must be logged in as a customer to subscribe. Go to login?');
      if (confirm) window.location.href = '/login/customer';
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscribe`,
        { tier: 2 },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.url) {
        console.log('✅ Redirecting to Stripe:', res.data.url);
        window.location.href = res.data.url;
      } else {
        alert('Subscription failed. No Stripe checkout link returned.');
      }
    } catch (err) {
      console.error('❌ Stripe subscription error:', err.response || err.message);
      alert('Error starting subscription. Check console.');
    }
  };

  return (
    <>
      <Navbar />

      <div className="home-container">
        <div className="home-header">
          <h1>Discover Hidden Treasures Near You</h1>
          <p>Search second-hand items from trusted local op shops.</p>
          <button className="cta-button" onClick={handleSubscribe}>
            Subscribe Now
          </button>
        </div>

        <RevealStatus />

        <div className="search-filter">
          <input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="quadrant-filter">
            {availableQuadrants.map(q => (
              <label key={q}>
                <input
                  type="checkbox"
                  value={q}
                  onChange={handleQuadrantChange}
                  checked={selectedQuadrants.includes(q)}
                />
                {q}
              </label>
            ))}
          </div>
        </div>

        <div className="item-list">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <ItemCard key={item.id} item={item} onUnlock={handleUnlock} />
            ))
          ) : (
            <p className="empty-message">
              No items found. Try adjusting your search or filters.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
