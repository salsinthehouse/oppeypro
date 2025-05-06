import React, { useState } from 'react';
import axios from 'axios';

const VendorItemForm = ({ vendorId, onItemCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    images: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, images: previews }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newItem = {
        ...formData,
        price: parseFloat(formData.price),
        vendorId,
      };
      const res = await axios.post('/api/vendors/items', newItem);
      alert('✅ Item created successfully!');
      onItemCreated(res.data);
      setFormData({
        name: '',
        description: '',
        price: '',
        location: '',
        images: []
      });
    } catch (err) {
      alert('❌ Failed to create item');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Add New Item</h2>
      <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Item Name" className="input" required />
      <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="input" />
      <input name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" className="input" type="number" required />
      <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Store Location" className="input" />
      <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
      <button type="submit" className="btn-primary">Add Item</button>
    </form>
  );
};

export default VendorItemForm;
