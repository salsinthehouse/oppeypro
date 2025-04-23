import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerHolds = () => {
  const [holds, setHolds] = useState([]);
  const token = localStorage.getItem('customerToken');

  useEffect(() => {
    const fetchHolds = async () => {
      try {
        const res = await axios.get('/api/cart/held', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHolds(res.data);
      } catch (err) {
        console.error('Failed to load held items:', err);
      }
    };

    fetchHolds();
  }, [token]);

  const handleCancel = async (cartId) => {
    try {
      await axios.delete(`/api/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHolds(prev => prev.filter(hold => hold._id !== cartId));
    } catch (err) {
      console.error('Failed to cancel hold:', err);
    }
  };

  const getRemainingTime = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffMs = expires - now;
    if (diffMs <= 0) return 'Expired';

    const mins = Math.floor((diffMs / 1000 / 60) % 60);
    const hrs = Math.floor((diffMs / 1000 / 60 / 60));
    return `${hrs}h ${mins}m left`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 My Held Items</h2>
      {holds.length === 0 ? (
        <p>You have no held items.</p>
      ) : (
        <div className="space-y-4">
          {holds.map((hold) => (
            <div key={hold._id} className="p-4 border rounded bg-white">
              <h4 className="text-lg font-bold">{hold.itemId.name}</h4>
              <p>{hold.itemId.description}</p>
              <p><strong>${hold.itemId.price.toFixed(2)}</strong></p>
              <p className="text-sm text-gray-500">
                Hold expires in: {getRemainingTime(hold.expiresAt)}
              </p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleCancel(hold._id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  ❌ Cancel Hold
                </button>
                {/* Future: Reveal Location / Purchase buttons */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerHolds;
