import React, { useEffect, useState } from 'react';

const VendorPortal = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const vendorEmail = localStorage.getItem('vendorEmail');
  const accessToken = localStorage.getItem('vendorAccessToken');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vendor/dashboard', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Access denied');
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDashboard();
  }, [accessToken]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Vendor Dashboard</h2>
      <p>Welcome, <strong>{vendorEmail}</strong> 👋</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {dashboardData && (
        <div>
          <h4>Protected API says:</h4>
          <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default VendorPortal;
