import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const VendorDashboard = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    images: '',
    _id: null, // null = add mode
  });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('vendorToken');

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get('/api/vendors/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error('❌ Error fetching items:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`/api/vendors/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('🗑 Item deleted');
      fetchItems();
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('❌ Failed to delete item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imagesArray = formData.images
      .split(',')
      .map((img) => img.trim())
      .filter((img) => img);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      location: formData.location,
      images: imagesArray,
    };

    try {
      if (formData._id) {
        // Edit item
        await axios.put(`/api/vendors/items/${formData._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('✏️ Item updated successfully');
      } else {
        // Create new item
        await axios.post('/api/vendors/items', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('✅ Item added successfully');
      }

      // Clear form and refresh
      setFormData({ name: '', description: '', price: '', location: '', images: '', _id: null });
      fetchItems();
    } catch (err) {
      console.error('Submit error:', err);
      setMessage('❌ Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      location: item.location,
      images: item.images.join(', '),
      _id: item._id,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Vendor Dashboard</h2>

      {message && <p className="text-green-600 font-medium mb-4">{message}</p>}

      {(items.length < 30 || formData._id) && (
        <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded space-y-4 mb-8">
          <h3 className="text-xl font-semibold">
            {formData._id ? '✏️ Edit Item' : '➕ Add New Item'}
          </h3>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Item Name"
            required
            className="input w-full"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="input w-full"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price (NZD)"
            required
            className="input w-full"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Store Location"
            className="input w-full"
          />
          <textarea
            name="images"
            value={formData.images}
            onChange={handleChange}
            placeholder="Image URLs (comma separated)"
            className="input w-full"
          />
          <button type="submit" className="btn-primary">
            {formData._id ? 'Update Item' : 'Add Item'}
          </button>
        </form>
      )}

      {items.length >= 30 && !formData._id && (
        <p className="text-red-600 font-semibold mb-6">
          ⚠️ You’ve reached your 30-item limit. Delete an item to add more.
        </p>
      )}

      <h3 className="text-xl font-semibold mb-2">📋 Your Items</h3>
      {items.length === 0 ? (
        <p>No items listed yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="p-4 border rounded bg-white">
              <h4 className="text-lg font-bold">#{item.itemNumber} — {item.name}</h4>
              <p>{item.description}</p>
              <p><strong>${item.price.toFixed(2)}</strong></p>
              <p className="text-sm text-gray-500">Views: {item.views} | Clicks: {item.clicks}</p>
              {item.heldBy && (
                <p className="text-sm text-red-500">Held by: {item.heldBy}</p>
              )}
              {item.images?.length > 0 && (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="mt-2 max-w-xs border rounded"
                />
              )}
              <div className="flex gap-4 mt-2">
                <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline text-sm">
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline text-sm">
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
