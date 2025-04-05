import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  // Each item has its own unlock state.
  const [locationUnlocked, setLocationUnlocked] = useState(false);

  return (
    <div className="item-card" style={{ border: '1px solid #ddd', padding: '1rem', margin: '1rem', width: '300px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <img src={item.imageUrl} alt={item.name} style={{ width: '100%', borderRadius: '4px' }} />
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p><strong>Shop:</strong> {item.shop}</p>
      
      {locationUnlocked ? (
        <p><strong>Location:</strong> {item.location}</p>
      ) : (
        <>
          <p><em>Store location is locked.</em></p>
          <button
            onClick={() => setLocationUnlocked(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#fff',
              color: '#ffa24d',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Unlock Store Location for $X
          </button>
        </>
      )}
      
      <Link to={`/items/${item.id}`} style={{ display: 'block', textAlign: 'center', padding: '0.5rem', backgroundColor: '#ffa24d', color: '#fff', borderRadius: '4px', textDecoration: 'none', marginTop: '0.5rem' }}>
        View Details
      </Link>
    </div>
  );
};

export default ItemCard;
