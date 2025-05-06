import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VendorItemList = ({ vendorId }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchVendorItems = async () => {
      try {
        const res = await axios.get('/api/vendors/items');
        setItems(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch items', err);
      }
    };

    fetchVendorItems();
  }, [vendorId]);

  return (
    <div className="p-4 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">My Items</h2>
      {items.length === 0 ? (
        <p>No items listed yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item._id} className="border p-3 rounded">
              <p><strong>#{item.itemNumber}</strong> — {item.name}</p>
              <p>💲 {item.price}</p>
              <p>👁 {item.views} views, 🖱 {item.clicks} clicks</p>
              {item.heldBy && <p>🔒 Held by customer</p>}
              <p className="text-sm text-gray-500">Created: {new Date(item.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VendorItemList;
