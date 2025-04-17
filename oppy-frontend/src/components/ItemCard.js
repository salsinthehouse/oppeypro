import React, { useState } from 'react';

const ItemCard = ({ item }) => {
  const [location, setLocation] = useState(item.location);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(!!item.location);

  const handleReveal = async () => {
    setError('');

    try {
      const token = localStorage.getItem('customerAccessToken');

      const res = await fetch(`http://localhost:5000/api/items/${item._id}/reveal`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setLocation(data.location);
        setRevealed(true);
      } else {
        setError(data.message || 'Unable to reveal location.');
      }
    } catch (err) {
      setError('Failed to contact server.');
    }
  };

  return (
    <div className="item-card">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p>${item.price}</p>

      {revealed ? (
        <p><strong>Location:</strong> {location}</p>
      ) : (
        <button onClick={handleReveal}>Reveal Location</button>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ItemCard;
