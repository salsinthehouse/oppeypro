import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // ✅ Make sure this is linked to your updated CSS

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    const domain = 'https://ap-southeast-2h3klci7kn.auth.ap-southeast-2.amazoncognito.com';
    const clientId = '5jf5h16hat2fcju90p0r2tjd6k';
    const redirect = 'https://oppy.co.nz';
    localStorage.clear();
    window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(redirect)}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/" className="navbar__brand">🏠 OPPY</Link>
        <Link to="/cart" className="navbar__link">🛒 Cart</Link>
      </div>

      <div className="navbar__links">
        {!isLoggedIn && (
          <>
            <Link to="/login" className="navbar__link">
              Customer Login / Register
            </Link>
            <Link to="/vendor/login" className="navbar__link">
              Store Login / Register
            </Link>
          </>
        )}

        {isLoggedIn && userType === 'vendor' && (
          <Link to="/vendor/dashboard" className="navbar__link" style={{ marginRight: '1rem' }}>
            📊 Dashboard
          </Link>
        )}

        {isLoggedIn && userType === 'customer' && (
          <Link to="/customer/dashboard" className="navbar__link" style={{ marginRight: '1rem' }}>
            📊 Dashboard
          </Link>
        )}

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="navbar__dropdown-item"
            style={{
              backgroundColor: '#fff',
              color: '#ffa24d',
              border: 'none',
              padding: '0.5rem 1rem',
              fontWeight: 'bold',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🔒 Log Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
