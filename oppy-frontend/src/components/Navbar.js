import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartIcon from './CartIcon'; // Ensure you have this component
import '../styles/Navbar.css';

const Navbar = () => {
  const vendorLoggedIn = localStorage.getItem('vendorLoggedIn') === 'true';
  const customerLoggedIn = localStorage.getItem('customerLoggedIn') === 'true';
  const vendorStoreName = localStorage.getItem('vendorStoreName') || '';
  const customerName = localStorage.getItem('customerName') || '';
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    if (vendorLoggedIn) {
      localStorage.removeItem('vendorLoggedIn');
      localStorage.removeItem('vendorStoreName');
    }
    if (customerLoggedIn) {
      localStorage.removeItem('customerLoggedIn');
      localStorage.removeItem('customerName');
    }
    navigate('/');
    window.location.reload();
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/" className="navbar__brand">OPPEY</Link>
      </div>
      <div className="navbar__links">
        {vendorLoggedIn ? (
          <>
            <span className="navbar__store-title">{vendorStoreName}</span>
            <div className="navbar__menu">
              <div className="navbar__burger" onClick={handleMenuToggle}>
                <div className="burger-line"></div>
                <div className="burger-line"></div>
                <div className="burger-line"></div>
              </div>
              {menuOpen && (
                <div className="navbar__dropdown">
                  <Link to="/account" className="navbar__dropdown-item" onClick={() => setMenuOpen(false)}>My Account</Link>
                  <Link to="/vendor" className="navbar__dropdown-item" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/settings" className="navbar__dropdown-item" onClick={() => setMenuOpen(false)}>Settings</Link>
                  <button className="navbar__dropdown-item" onClick={handleLogout}>Log Out</button>
                </div>
              )}
            </div>
          </>
        ) : customerLoggedIn ? (
          <>
            <span className="navbar__store-title">{customerName}</span>
            <div className="navbar__menu">
              <div className="navbar__burger" onClick={handleMenuToggle}>
                <div className="burger-line"></div>
                <div className="burger-line"></div>
                <div className="burger-line"></div>
              </div>
              {menuOpen && (
                <div className="navbar__dropdown">
                  <Link to="/account" className="navbar__dropdown-item" onClick={() => setMenuOpen(false)}>My Account</Link>
                  <Link to="/customer-dashboard" className="navbar__dropdown-item" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/settings" className="navbar__dropdown-item" onClick={() => setMenuOpen(false)}>Account Settings</Link>
                  <button className="navbar__dropdown-item" onClick={handleLogout}>Log Off</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login/customer" className="navbar__link">Login as Customer</Link>
            <Link to="/login/vendor" className="navbar__link">Login as Vendor</Link>
            <Link to="/register/store" className="navbar__link">Register as Store</Link>
          </>
        )}
        <div className="cart-icon-wrapper">
          <CartIcon />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
