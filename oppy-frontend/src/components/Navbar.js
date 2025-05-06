import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css'; // ✅ Make sure this is linked to your updated CSS

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, userType, userName, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // First clear local state and storage
    logout();
    
    // Navigate to home page first
    navigate('/', { replace: true });
    
    // Then redirect to Cognito logout
    const domain = 'https://ap-southeast-2h3klci7kn.auth.ap-southeast-2.amazoncognito.com';
    const clientId = '5jf5h16hat2fcju90p0r2tjd6k';
    const redirect = `${window.location.origin}`;
    
    // Use setTimeout to ensure navigation happens before Cognito logout
    setTimeout(() => {
      window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(redirect)}`;
    }, 100);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Oppy</Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>
      </div>

      <div className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
        {token ? (
          <>
            <Link to={`/${userType}/dashboard`}>Dashboard</Link>
            <span className="user-greeting">Hello, {userName}</span>
            <button onClick={handleLogout} className="logout-button">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login/customer">Customer Login</Link>
            <Link to="/login/vendor">Vendor Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
