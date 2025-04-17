import React, { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';
import RevealStatus from '../components/RevealStatus';
import logo from '../assets/logo.png';

const availableQuadrants = ['Central', 'North', 'South', 'East', 'West'];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuadrants, setSelectedQuadrants] = useState([]);
  const [vendorItems, setVendorItems] = useState([]);

  // Load vendor items from localStorage (if any)
  useEffect(() => {
    const storedVendorItems = localStorage.getItem('vendorItems');
    if (storedVendorItems) {
      setVendorItems(JSON.parse(storedVendorItems));
    }
  }, []);

  // Filter items based on search term, quadrant selection, and only active items are shown
  const filteredItems = vendorItems.filter(item => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(lowerSearch) ||
      item.description.toLowerCase().includes(lowerSearch);
    const matchesQuadrant =
      selectedQuadrants.length === 0 || selectedQuadrants.includes(item.quadrant);
    return (!item.status || item.status === 'active') && matchesSearch && matchesQuadrant;
  });

  // Unlock function: add the item to cart without updating vendorItems status.
  // The item remains visible on Home until the customer confirms the hold in the Cart.
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
    if (checked) {
      setSelectedQuadrants([...selectedQuadrants, value]);
    } else {
      setSelectedQuadrants(selectedQuadrants.filter(q => q !== value));
    }
  };

  return (
    <div className="home-page" style={{ textAlign: 'center', padding: '2rem', marginTop: '80px' }}>
      <img src={logo} alt="oppey logo" style={{ height: '300px', marginBottom: '1rem' }} />

      <RevealStatus />

      <div
        className="search-filter"
        style={{
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          backgroundColor: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
      >
        <input
          type="text"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.5rem',
            maxWidth: '300px',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <div className="quadrant-filter" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {availableQuadrants.map(q => (
            <label
              key={q}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: '#000'
              }}
            >
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

      <div className="item-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} onUnlock={handleUnlock} />
        ))}
      </div>
    </div>
  );
};

export default Home;
