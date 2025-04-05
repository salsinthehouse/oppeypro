import React, { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';
import logo from '../assets/logo.png';

const availableQuadrants = ['Central', 'North', 'South', 'East', 'West'];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // Using an array to store selected quadrants
  const [selectedQuadrants, setSelectedQuadrants] = useState([]);
  const [vendorItems, setVendorItems] = useState([]);

  // On component mount, load vendor items from localStorage
  useEffect(() => {
    const storedVendorItems = localStorage.getItem('vendorItems');
    if (storedVendorItems) {
      setVendorItems(JSON.parse(storedVendorItems));
    }
  }, []);

  // With dummy items removed, all items come from vendorItems only
  const allItems = vendorItems;

  // Filter items by name/description and quadrant.
  // If no quadrant is selected, show all items.
  const filteredItems = allItems.filter(item => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(lowerSearch) ||
      item.description.toLowerCase().includes(lowerSearch);
    const matchesQuadrant =
      selectedQuadrants.length === 0 || selectedQuadrants.includes(item.quadrant);
    return matchesSearch && matchesQuadrant;
  });

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
      {/* Display the enlarged logo */}
      <img src={logo} alt="oppey logo" style={{ height: '300px', marginBottom: '1rem' }} />

      {/* Search and Quadrant Filter */}
      <div
        className="search-filter"
        style={{
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <input
          type="text"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', maxWidth: '300px', width: '100%' }}
        />
        <div
          className="quadrant-filter"
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
        >
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

      {/* Item Listings */}
      <div
        className="item-list"
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}
      >
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
