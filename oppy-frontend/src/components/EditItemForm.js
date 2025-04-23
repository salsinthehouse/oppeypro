import React, { useState } from 'react';
import axios from 'axios';

const EditItemForm = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description,
    price: item.price,
    location: item.location,
    images: item.images,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/items/${item._id}`, formData);
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  return (
    <div className="edit-item-form p-4 border rounded bg-white shadow max-w-md mx-auto mt-4">
      <h3 className="text-lg font-bold mb-4">Edit Item</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full mb-2 p-2 border rounded"
        />
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded mr-2">
          Save
        </button>
        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditItemForm;
