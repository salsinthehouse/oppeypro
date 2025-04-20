import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Cart.css';

const Cart = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE;
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('cartItems')) || []);
  const [subscription, setSubscription] = useState(() => localStorage.getItem('subscription') === 'true');

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('subscription', subscription.toString());
  }, [subscription]);

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);

    const storedVendorItems = JSON.parse(localStorage.getItem('vendorItems')) || [];
    const updatedVendorItems = storedVendorItems.map(item =>
      item.id === itemId ? { ...item, status: 'active', held: false, pickupTime: '' } : item
    );
    localStorage.setItem('vendorItems', JSON.stringify(updatedVendorItems));
    window.dispatchEvent(new Event('vendorItemsUpdated'));
  };

  const handleHoldItem = async (itemId) => {
    const pickupTime = prompt("Please enter your preferred pick-up time (e.g., 'April 10, 3:00 PM'):");
    if (!pickupTime) return;

    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, held: true, pickupTime, status: 'held' } : item
    );
    setCartItems(updatedCart);

    const storedVendorItems = JSON.parse(localStorage.getItem('vendorItems')) || [];
    const updatedVendorItems = storedVendorItems.map(item =>
      item.id === itemId ? { ...item, held: true, pickupTime, status: 'held' } : item
    );
    localStorage.setItem('vendorItems', JSON.stringify(updatedVendorItems));
    window.dispatchEvent(new Event('vendorItemsUpdated'));

    // (Optional) Send hold update to backend
    try {
      await axios.post(`${BASE_URL}/cart/hold`, {
        itemId,
        pickupTime
      });
    } catch (err) {
      console.error('Failed to notify backend:', err);
    }

    alert(`Hold confirmed. Your pick-up time is set to: ${pickupTime}`);
  };

  const handlePaymentDetails = () => {
    alert("Proceeding to payment...");
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      <div className="cart-subscription">
        <label>
          <input
            type="checkbox"
            checked={subscription}
            onChange={() => setSubscription(!subscription)}
          />
          Subscribe for $2.00/month for unlimited unlocks
        </label>
      </div>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty. Unlock an item to add it here!</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="cart-item">
              {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p><strong>Price:</strong> {item.price}</p>
                <p><strong>Quadrant:</strong> {item.quadrant}</p>
                <p><strong>Location:</strong> {item.location}</p>
                {item.held && item.pickupTime ? (
                  <>
                    <p className="held">Item Held</p>
                    <p><strong>Pick-Up Time:</strong> {item.pickupTime}</p>
                  </>
                ) : (
                  <button onClick={() => handleHoldItem(item.id)}>Hold Item</button>
                )}
                <button onClick={() => handleRemoveItem(item.id)}>Remove Item</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-checkout">
        <button onClick={handlePaymentDetails}>Enter Payment Details and Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
