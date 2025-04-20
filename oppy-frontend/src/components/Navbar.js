import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const customerLoggedIn = !!localStorage.getItem('customerAccessToken');
  const vendorLoggedIn = !!localStorage.getItem('vendorToken');

  const handleLogout = () => {
    const domain = 'https://ap-southeast-2h3klci7kn.auth.ap-southeast-2.amazoncognito.com';
    const clientId = '5jf5h16hat2fcju90p0r2tjd6k';
    const redirect = 'http://oppy.co.nz';
    localStorage.clear();
    window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(redirect)}`;
  };

  return (
    <nav className="navbar" style={{ backgroundColor: '#ffa24d', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to="/" style={{ color: '#fff', fontWeight: 'bold', marginRight: '1rem' }}>🏠 OPPY</Link>
        <Link to="/cart" style={{ color: '#fff', marginRight: '1rem' }}>🛒 Cart</Link>
      </div>

      <div>
        {!customerLoggedIn && !vendorLoggedIn && (
          <>
            <Link to="/customer/auth" style={{ color: '#fff', marginRight: '1rem' }}>
              Customer Login / Register
            </Link>
            <Link to="/vendor/auth" style={{ color: '#fff', marginRight: '1rem' }}>
              Store Login / Register
            </Link>
          </>
        )}

        {(customerLoggedIn || vendorLoggedIn) && (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#fff',
              color: '#ffa24d',
              border: 'none',
              padding: '0.5rem 1rem',
              fontWeight: 'bold',
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
