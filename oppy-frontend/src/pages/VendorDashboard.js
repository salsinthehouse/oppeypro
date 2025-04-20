import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VendorDashboard = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    images: ''
  });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('vendorToken');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('/api/vendor/items', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(res.data);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };

    fetchItems();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        images: formData.images.split(',').map((img) => img.trim())
      };

      const res = await axios.post('/api/vendor/items', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage(res.data.message);
      setFormData({ name: '', description: '', price: '', location: '', images: '' });

      const refreshedItems = await axios.get('/api/vendor/items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(refreshedItems.data);
    } catch (err) {
      console.error('Error uploading item:', err);
      setMessage(err.response?.data?.message || 'Error uploading item');
    }
  };

  return (
    <div className="vendor-dashboard" style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h2>📦 Vendor Dashboard</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      {items.length < 30 ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <h3>Add New Item</h3>
          <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
          <input type="text" name="images" placeholder="Image URLs (comma separated)" value={formData.images} onChange={handleChange} />
          <button type="submit">Add Item</button>
        </form>
      ) : (
        <p>You’ve reached your 30-item limit. Delete an item to add more.</p>
      )}

      <h3>Your Items</h3>
      {items.length === 0 ? (
        <p>No items listed yet.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <p><strong>${item.price}</strong></p>
              <p><small>Item #{item.itemNumber}</small></p>
              {item.images?.length > 0 && (
                <img src={item.images[0]} alt={item.name} width="150" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
