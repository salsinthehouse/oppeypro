import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // ✅ Make sure this is linked to your updated CSS

const Navbar = () => {
  const customerLoggedIn = !!localStorage.getItem('customerAccessToken');
  const vendorLoggedIn = !!localStorage.getItem('vendorToken');

  const handleLogout = () => {
    const domain = 'https://ap-southeast-2h3klci7kn.auth.ap-southeast-2.amazoncognito.com';
    const clientId = '5jf5h16hat2fcju90p0r2tjd6k';
    const redirect = 'https://oppy.co.nz'; // ✅ Use https for production
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
        {!customerLoggedIn && !vendorLoggedIn && (
          <>
            <Link to="/customer/auth" className="navbar__link">
              Customer Login / Register
            </Link>
            <Link to="/vendor/auth" className="navbar__link">
              Store Login / Register
            </Link>
          </>
        )}

        {vendorLoggedIn && (
          <Link to="/vendor/dashboard" className="navbar__link" style={{ marginRight: '1rem' }}>
            📊 Dashboard
          </Link>
        )}

        {(customerLoggedIn || vendorLoggedIn) && (
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
