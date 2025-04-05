import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ShopCard = ({ shop }) => {
  const [locationUnlocked, setLocationUnlocked] = useState(false);

  return (
    <div className="shop-card" style={{ border: '1px solid #ddd', padding: '1rem', margin: '1rem', width: '300px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <img src={shop.imageUrl} alt={shop.name} style={{ width: '100%', borderRadius: '4px' }} />
      <h3>{shop.name}</h3>
      <p>{shop.description}</p>
      {locationUnlocked ? (
        <p><strong>Location:</strong> {shop.location}</p>
      ) : (
        <>
          <p><em>Location locked.</em></p>
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
            Unlock Location for $X
          </button>
        </>
      )}
      <Link to={`/shops/${shop.id}`} style={{ display: 'block', textAlign: 'center', padding: '0.5rem', backgroundColor: '#ffa24d', color: '#fff', borderRadius: '4px', textDecoration: 'none', marginTop: '0.5rem' }}>
        View Details
      </Link>
    </div>
  );
};

export default ShopCard;
