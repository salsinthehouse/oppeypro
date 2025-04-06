import React, { useState, useEffect } from 'react';
import '../styles/Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('cartItems')) || []);
  const [subscription, setSubscription] = useState(() => localStorage.getItem('subscription') === 'true');

  // Update localStorage and dispatch a custom event when cartItems change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cartItems]);

  // Update subscription in localStorage
  useEffect(() => {
    localStorage.setItem('subscription', subscription.toString());
  }, [subscription]);

  // Remove an item from the cart
  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
  };

  // Hold an item: prompt for pickup time and mark the item as held
  const handleHoldItem = (itemId) => {
    // You could replace this prompt with a proper date/time picker later.
    const pickupTime = prompt("Please enter your preferred pick-up time (e.g., 'April 10, 3:00 PM'):");
    if (!pickupTime) return;

    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, held: true, pickupTime } : item
    );
    setCartItems(updatedCart);
    alert(`Hold confirmed. Your pick-up time is set to: ${pickupTime}`);
  };

  // Simulated function for entering payment details
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
                {item.held ? (
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
