import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CartIcon.css';

const CartIcon = () => {
  const [count, setCount] = useState(0);

  const updateCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCount(cartItems.length);
  };

  useEffect(() => {
    updateCount();
    window.addEventListener('cartUpdated', updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('cartUpdated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return (
    <div className="cart-icon">
      <Link to="/cart">
        <svg className="cart-icon__svg" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 4H5l-3 7v2h2l2-4h10l2 4h2v-2l-3-7h-2"></path>
          <circle cx="9" cy="20" r="2"></circle>
          <circle cx="17" cy="20" r="2"></circle>
        </svg>
        {count > 0 && <span className="cart-icon__counter">{count}</span>}
      </Link>
    </div>
  );
};

export default CartIcon;
