import React, { useEffect, useState } from 'react';
import '../styles/VendorDashboard.css';

const VendorDashboard = () => {
  const [vendorData, setVendorData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vendorAccessToken');

    if (!token) {
      setError('No access token found. Please log in.');
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/api/vendor/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Access denied. Insufficient group permissions.') {
          throw new Error(data.message);
        }
        setVendorData(data);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to load vendor dashboard.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="vendor-dashboard">
      <h2>Vendor Dashboard</h2>

      {loading && <p>Loading dashboard...</p>}

      {error && <p className="error">{error}</p>}

      {vendorData && (
        <div className="vendor-info">
          <p>Welcome, <strong>{vendorData.email || vendorData.username}</strong>!</p>
          <p>This is your dashboard. More features coming soon.</p>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
    