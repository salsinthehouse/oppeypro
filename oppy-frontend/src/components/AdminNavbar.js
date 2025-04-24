// File: src/components/AdminNavbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AdminNavbar.css'; // optional if you want to extract the inline styles

const AdminNavbar = () => {
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem('adminEmail') || '';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/');
  };

  return (
    <nav
      style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Link
        to="/admin"
        style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
      >
        🛠️ Admin Dashboard
      </Link>
      <div>
        <span style={{ marginRight: '1rem' }}>{adminEmail}</span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#ffa24d',
            border: 'none',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔒 Log Out
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
