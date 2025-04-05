import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const vendorLoggedIn = localStorage.getItem('vendorLoggedIn') === 'true';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('vendorLoggedIn');
    localStorage.removeItem('vendorStoreName');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffa24d',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div>
        <Link
          to="/"
          style={{
            color: '#fff',
            marginRight: '1rem',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          oppey
        </Link>
      </div>
      <div>
        {vendorLoggedIn ? (
          <>
            <Link
              to="/account"
              style={{
                color: '#fff',
                marginRight: '1rem',
                textDecoration: 'none',
              }}
            >
              My Account
            </Link>
            <Link
              to="/vendor"
              style={{
                color: '#fff',
                marginRight: '1rem',
                textDecoration: 'none',
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              style={{
                color: '#fff',
                marginRight: '1rem',
                textDecoration: 'none',
              }}
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login/customer"
              style={{
                color: '#fff',
                marginRight: '1rem',
                textDecoration: 'none',
              }}
            >
              Login as Customer
            </Link>
            <Link
              to="/login/vendor"
              style={{
                color: '#fff',
                marginRight: '1rem',
                textDecoration: 'none',
              }}
            >
              Login as Vendor
            </Link>
            <Link
              to="/register/store"
              style={{ color: '#fff', textDecoration: 'none' }}
            >
              Register as Store
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
