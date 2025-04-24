import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('adminToken');
  const baseUrl = process.env.REACT_APP_API_URL || 'window.location.origin';

  useEffect(() => {
    if (!token) {
      navigate('/login/admin');
      return;
    }

    const fetchPendingVendors = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/admin/vendors/pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVendors(res.data);
      } catch (err) {
        console.error('Error loading pending vendors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingVendors();
  }, [token, navigate, baseUrl]);

  const approveVendor = async (email) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/admin/vendors/approve`,
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

  return (
    <div className="admin-container">
      <h2>🛠️ Admin Dashboard – Pending Vendor Approvals</h2>

      {message && <p className="message">{message}</p>}

      {loading ? (
        <p>Loading pending vendors…</p>
      ) : vendors.length === 0 ? (
        <p>No pending vendors.</p>
      ) : (
        vendors.map((vendor) => (
          <div key={vendor.username} className="vendor-card">
            <p><strong>Email:</strong> {vendor.email || 'N/A'}</p>
            <p><strong>Username:</strong> {vendor.username}</p>
            <p><strong>Signed up:</strong> {new Date(vendor.signupDate).toLocaleString()}</p>
            <button onClick={() => approveVendor(vendor.email)}>
              ✅ Approve Vendor
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
