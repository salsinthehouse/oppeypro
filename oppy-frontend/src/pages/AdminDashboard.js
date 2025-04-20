import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchPendingVendors = async () => {
      try {
        const res = await axios.get('/api/admin/vendors/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVendors(res.data);
      } catch (err) {
        console.error('Error loading pending vendors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingVendors();
  }, [token]);

  const approveVendor = async (email) => {
    try {
      const res = await axios.post(
        '/api/admin/vendors/approve',
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage(res.data.message);
      setVendors((prev) => prev.filter((v) => v.email !== email));
    } catch (err) {
      console.error('Error approving vendor:', err);
      setMessage(err.response?.data?.message || 'Failed to approve vendor');
    }
  };

  const handleLogout = () => {
    const domain = 'https://ap-southeast-2h3klci7kn.auth.ap-southeast-2.amazoncognito.com';
    const redirect = 'https://oppy.co.nz';
    localStorage.clear();
    window.location.href = `${domain}/logout?client_id=5jf5h16hat2fcju90p0r2tjd6k&logout_uri=${encodeURIComponent(redirect)}`;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h2>🛠️ Admin Dashboard - Pending Vendor Approvals</h2>
      <button
        onClick={handleLogout}
        style={{
          marginBottom: '1rem',
          backgroundColor: '#dc3545',
          color: '#fff',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🚪 Log Out
      </button>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      {loading ? (
        <p>Loading pending vendors...</p>
      ) : vendors.length === 0 ? (
        <p>No pending vendors.</p>
      ) : (
        vendors.map((vendor) => (
          <div
            key={vendor.username}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <p><strong>Email:</strong> {vendor.email || 'N/A'}</p>
            <p><strong>Username:</strong> {vendor.username}</p>
            <p><strong>Signed up:</strong> {new Date(vendor.signupDate).toLocaleString()}</p>
            <button
              onClick={() => approveVendor(vendor.email)}
              style={{
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ✅ Approve Vendor
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
