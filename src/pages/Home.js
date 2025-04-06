import React, { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';
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

  // All items come from vendorItems in this prototype
  const allItems = vendorItems;

  // Filter items based on search term and quadrant selection
  const filteredItems = allItems.filter(item => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(lowerSearch) ||
      item.description.toLowerCase().includes(lowerSearch);
    const matchesQuadrant =
      selectedQuadrants.length === 0 || selectedQuadrants.includes(item.quadrant);
    return matchesSearch && matchesQuadrant && !item.held; // Only show items that are not held
  });

  // Unlock function: adds the item to cartItems in localStorage and dispatches event
  const handleUnlock = (item) => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (!cartItems.find(i => i.id === item.id)) {
      cartItems.push({ ...item, unlocked: true });
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

  // Handle item being held (mark it as held and update the vendorItems state)
  const handleHoldItem = (itemId, pickupTime) => {
    const updatedItems = vendorItems.map(item =>
      item.id === itemId ? { ...item, held: true, pickupTime } : item
    );
    setVendorItems(updatedItems);
    localStorage.setItem('vendorItems', JSON.stringify(updatedItems));

    alert(`Item is now held. Pick-up time: ${pickupTime}`);
  };

  return (
    <div className="home-page" style={{ textAlign: 'center', padding: '2rem', marginTop: '80px' }}>
      <img src={logo} alt="oppey logo" style={{ height: '300px', marginBottom: '1rem' }} />

      <div className="search-filter" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', maxWidth: '300px', width: '100%' }}
        />
        <div className="quadrant-filter" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {availableQuadrants.map((q) => (
            <label key={q} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
          <ItemCard key={item.id} item={item} onUnlock={handleUnlock}>
            <button onClick={() => handleHoldItem(item.id, prompt("Enter your preferred pick-up time (e.g., 'April 10, 3:00 PM')"))}>
              Hold Item
            </button>
          </ItemCard>
        ))}
      </div>
    </div>
  );
};

export default Home;
