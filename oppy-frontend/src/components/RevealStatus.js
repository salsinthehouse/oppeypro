// File: components/RevealStatus.js

import React, { useEffect, useState } from 'react';

const RevealStatus = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('customerAccessToken');

        const res = await fetch('http://localhost:5000/api/items/reveal/status', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok) {
          setStatus(data);
        } else {
          setError(data.message || 'Error fetching reveal status');
        }
      } catch (err) {
        setError('Failed to connect to server');
      }
    };

    fetchStatus();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!status) return <p>Loading reveal status...</p>;

  const resetTime = new Date(status.resetAt).toLocaleTimeString();

  return (
    <div style={{
      background: '#f8f8f8',
      padding: '1rem',
      marginBottom: '1.5rem',
      border: '1px solid #ddd',
      borderRadius: '6px'
    }}>
      <strong>Reveals used today:</strong> {status.revealsUsedToday} / 1<br />
      <strong>Resets at:</strong> {resetTime}
    </div>
  );
};

export default RevealStatus;
