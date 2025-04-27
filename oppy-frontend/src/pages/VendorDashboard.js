import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/VendorDashboard.css';

const VendorDashboard = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    images: [],
    _id: null,
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('vendorAccessToken') || localStorage.getItem('vendorToken');

  useEffect(() => {
    if (!token) {
      navigate('/vendor/auth');
      return;
    }
  }, [token, navigate]);

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get('/api/vendors/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error('❌ Error fetching items:', err);
      setMessage({ text: 'Failed to fetch items', type: 'error' });
      if (err.response?.status === 401) {
        localStorage.removeItem('vendorAccessToken');
        localStorage.removeItem('vendorToken');
        navigate('/vendor/auth');
      }
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      fetchItems();
    }
  }, [fetchItems, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return [];
    
    const formData = new FormData();
    formData.append('image', selectedImage);
    
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return [res.data.url];
    } catch (err) {
      console.error('Upload error:', err);
      setMessage({ text: 'Failed to upload image', type: 'error' });
      if (err.response?.status === 401) {
        localStorage.removeItem('vendorAccessToken');
        localStorage.removeItem('vendorToken');
        navigate('/vendor/auth');
      }
      return [];
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      setIsLoading(true);
      await axios.delete(`/api/vendors/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ text: 'Item deleted successfully', type: 'success' });
      fetchItems();
    } catch (err) {
      console.error('Delete error:', err);
      setMessage({ text: 'Failed to delete item', type: 'error' });
      if (err.response?.status === 401) {
        localStorage.removeItem('vendorAccessToken');
        localStorage.removeItem('vendorToken');
        navigate('/vendor/auth');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let imageUrls = formData.images;
      if (selectedImage) {
        imageUrls = await uploadImage();
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        images: imageUrls,
      };

      if (formData._id) {
        await axios.put(`/api/vendors/items/${formData._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage({ text: 'Item updated successfully', type: 'success' });
      } else {
        await axios.post('/api/vendors/items', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage({ text: 'Item added successfully', type: 'success' });
      }

      setFormData({ name: '', description: '', price: '', location: '', images: [], _id: null });
      setSelectedImage(null);
      setPreviewImage('');
      fetchItems();
    } catch (err) {
      console.error('Submit error:', err);
      setMessage({ text: 'Failed to save item', type: 'error' });
      if (err.response?.status === 401) {
        localStorage.removeItem('vendorAccessToken');
        localStorage.removeItem('vendorToken');
        navigate('/vendor/auth');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      location: item.location,
      images: item.images,
      _id: item._id,
    });
    setPreviewImage(item.images[0] || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!token) {
    return null;
  }

  return (
    <div className="vendor-dashboard">
      <div className="dashboard-header">
        <h2>Vendor Dashboard</h2>
        <p className="dashboard-subtitle">Manage your items and track performance</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="dashboard-content">
        <div className="item-form-container">
          {(items.length < 30 || formData._id) && (
            <form onSubmit={handleSubmit} className="item-form">
              <h3>{formData._id ? 'Edit Item' : 'Add New Item'}</h3>
              
              <div className="form-group">
                <label htmlFor="name">Item Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter item description"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price (NZD)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Store Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image">Item Image</label>
                <div className="image-upload">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-input"
                  />
                  {previewImage && (
                    <div className="image-preview">
                      <img src={previewImage} alt="Preview" />
                      <button 
                        type="button" 
                        className="remove-image"
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewImage('');
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Saving...' : (formData._id ? 'Update Item' : 'Add Item')}
              </button>
            </form>
          )}
        </div>

        <div className="items-list">
          <h3>Your Items ({items.length}/30)</h3>
          {items.length === 0 ? (
            <p>No items found. Add your first item above.</p>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div key={item._id} className="item-card">
                  {item.images?.length > 0 && (
                    <img src={item.images[0]} alt={item.name} className="item-image" />
                  )}
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <p className="price">${item.price.toFixed(2)}</p>
                    <p className="location">{item.location}</p>
                    <div className="item-actions">
                      <button onClick={() => handleEdit(item)} className="edit-button">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="delete-button">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
