import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const vendorLoggedIn = !!localStorage.getItem('vendorAccessToken');
  const customerLoggedIn = !!localStorage.getItem('customerAccessToken');
  const vendorEmail = localStorage.getItem('vendorEmail');
  const customerEmail = localStorage.getItem('customerEmail');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('vendorAccessToken');
    localStorage.removeItem('vendorEmail');
    localStorage.removeItem('customerAccessToken');
    localStorage.removeItem('customerEmail');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/" className="navbar__brand">OPPY</Link>
      </div>

      <div className="navbar__links">
        <Link to="/" className="navbar__link">Home</Link>
        <Link to="/cart" className="navbar__link">Cart</Link>

        {vendorLoggedIn && (
          <>
            <span className="navbar__store-title">
              Welcome, {vendorEmail}
            </span>
            <Link to="/vendor/dashboard" className="navbar__link">Dashboard</Link>
            <button onClick={handleLogout} className="navbar__link">Logout</button>
          </>
        )}

        {customerLoggedIn && !vendorLoggedIn && (
          <>
            <span className="navbar__store-title">
              Welcome, {customerEmail}
            </span>
            <button onClick={handleLogout} className="navbar__link">Logout</button>
          </>
        )}

        {!vendorLoggedIn && !customerLoggedIn && (
          <>
            <Link to="/login/customer" className="navbar__link">Customer Login</Link>
            <Link to="/register/customer" className="navbar__link">Register</Link>
            <Link to="/login/vendor" className="navbar__link">Vendor Login</Link>
            <Link to="/register/store" className="navbar__link">Register Store</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
