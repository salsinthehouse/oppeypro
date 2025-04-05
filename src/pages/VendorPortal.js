import React, { useState, useEffect } from 'react';
import '../styles/VendorPortal.css';

const VendorPortal = () => {
  // Retrieve vendor store name from localStorage (set during login/registration)
  const vendorStoreName = localStorage.getItem('vendorStoreName') || 'Your Store';

  // Load vendor items from localStorage if available
  const initialVendorItems = JSON.parse(localStorage.getItem('vendorItems')) || [];
  const [items, setItems] = useState(initialVendorItems);

  // State for the new item form; pre-populate location if desired, quadrant defaults to "Central"
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    imageUrl: '',
    location: '',
    price: '',
    condition: 'New',
    quadrant: 'Central'
  });

  // State for editing an existing item
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemData, setEditingItemData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    location: '',
    price: '',
    condition: 'New',
    quadrant: 'Central'
  });

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('vendorItems', JSON.stringify(items));
  }, [items]);

  const handleNewItemChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageUrl' && files && files[0]) {
      const imageURL = URL.createObjectURL(files[0]);
      setNewItem({ ...newItem, imageUrl: imageURL });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  const handleNewItemSubmit = (e) => {
    e.preventDefault();
    if (items.length >= 20) {
      alert("Maximum of 20 items reached. You cannot add more items.");
      return;
    }
    const itemToAdd = {
      ...newItem,
      id: Date.now(),
      shop: vendorStoreName,
      inventoryNumber: items.length + 1
    };
    setItems([...items, itemToAdd]);
    setNewItem({ name: '', description: '', imageUrl: '', location: newItem.location, price: '', condition: 'New', quadrant: 'Central' });
  };

  const handleEditClick = (item) => {
    setEditingItemId(item.id);
    setEditingItemData({
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      location: item.location,
      price: item.price,
      condition: item.condition,
      quadrant: item.quadrant
    });
  };

  const handleEditingItemChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageUrl' && files && files[0]) {
      const imageURL = URL.createObjectURL(files[0]);
      setEditingItemData({ ...editingItemData, imageUrl: imageURL });
    } else {
      setEditingItemData({ ...editingItemData, [name]: value });
    }
  };

  const handleEditSubmit = (e, itemId) => {
    e.preventDefault();
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, ...editingItemData };
      }
      return item;
    });
    setItems(updatedItems);
    setEditingItemId(null);
  };

  const handleEditCancel = () => {
    setEditingItemId(null);
  };

  return (
    <div className="vendor-portal">
      <header className="vendor-portal__header">
        <h2>Vendor Portal</h2>
        <h3>Welcome, {vendorStoreName}</h3>
      </header>

      <section className="vendor-portal__items">
        <h4>Your Items</h4>
        {items.length === 0 ? (
          <p className="vendor-portal__empty">No items listed yet.</p>
        ) : (
          <div className="vendor-portal__grid">
            {items.map(item => (
              <div key={item.id} className="vendor-portal__item">
                {editingItemId === item.id ? (
                  <form onSubmit={(e) => handleEditSubmit(e, item.id)} className="vendor-portal__form--edit">
                    <div className="vendor-portal__form-group">
                      <label>Item Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={editingItemData.name}
                        onChange={handleEditingItemChange}
                        required
                      />
                    </div>
                    <div className="vendor-portal__form-group">
                      <label>Description:</label>
                      <textarea
                        name="description"
                        value={editingItemData.description}
                        onChange={handleEditingItemChange}
                        required
                      />
                    </div>
                    <div className="vendor-portal__form-group">
                      <label>Price:</label>
                      <input
                        type="text"
                        name="price"
                        value={editingItemData.price}
                        onChange={handleEditingItemChange}
                        required
                      />
                    </div>
                    <div className="vendor-portal__form-group">
                      <label>Condition:</label>
                      <select
                        name="condition"
                        value={editingItemData.condition}
                        onChange={handleEditingItemChange}
                        required
                      >
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                        <option value="Refurbished">Refurbished</option>
                      </select>
                    </div>
                    <div className="vendor-portal__form-group">
                      <label>Quadrant:</label>
                      <select
                        name="quadrant"
                        value={editingItemData.quadrant}
                        onChange={handleEditingItemChange}
                        required
                      >
                        <option value="Central">Central</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                      </select>
                    </div>
                    <div className="vendor-portal__form-group">
                      <label>Upload New Image:</label>
                      <input
                        type="file"
                        name="imageUrl"
                        accept="image/*"
                        onChange={handleEditingItemChange}
                      />
                    </div>
                    <div className="vendor-portal__form-group">
                      <label>Location:</label>
                      <input
                        type="text"
                        name="location"
                        value={editingItemData.location}
                        onChange={handleEditingItemChange}
                        required
                      />
                    </div>
                    <div className="vendor-portal__form-buttons">
                      <button type="submit">Save</button>
                      <button type="button" onClick={handleEditCancel}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h4>{item.inventoryNumber}. {item.name}</h4>
                    <p>{item.description}</p>
                    <p><strong>Price:</strong> {item.price}</p>
                    <p><strong>Condition:</strong> {item.condition}</p>
                    <p><strong>Quadrant:</strong> {item.quadrant}</p>
                    {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                    <p><strong>Location:</strong> {item.location}</p>
                    <button onClick={() => handleEditClick(item)}>Edit</button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <h3>Add a New Item</h3>
      <div className="vendor-portal__form-container">
        {items.length < 20 ? (
          <form onSubmit={handleNewItemSubmit} className="vendor-portal__form">
            <div className="vendor-portal__form-group">
              <label>Item Name:</label>
              <input 
                type="text" 
                name="name" 
                value={newItem.name} 
                onChange={handleNewItemChange} 
                required
              />
            </div>
            <div className="vendor-portal__form-group">
              <label>Description:</label>
              <textarea 
                name="description" 
                value={newItem.description} 
                onChange={handleNewItemChange} 
                required
              />
            </div>
            <div className="vendor-portal__form-group">
              <label>Price:</label>
              <input 
                type="text" 
                name="price" 
                value={newItem.price} 
                onChange={handleNewItemChange} 
                required
              />
            </div>
            <div className="vendor-portal__form-group">
              <label>Condition:</label>
              <select
                name="condition"
                value={newItem.condition}
                onChange={handleNewItemChange}
                required
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>
            <div className="vendor-portal__form-group">
              <label>Quadrant:</label>
              <select
                name="quadrant"
                value={newItem.quadrant}
                onChange={handleNewItemChange}
                required
              >
                <option value="Central">Central</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
            </div>
            <div className="vendor-portal__form-group">
              <label>Upload Image:</label>
              <input 
                type="file" 
                name="imageUrl" 
                accept="image/*"
                onChange={handleNewItemChange} 
                required
              />
            </div>
            <div className="vendor-portal__form-group">
              <label>Location:</label>
              <input 
                type="text" 
                name="location" 
                value={newItem.location} 
                onChange={handleNewItemChange} 
                required
              />
            </div>
            <div className="vendor-portal__form-buttons">
              <button type="submit">Add Item</button>
            </div>
          </form>
        ) : (
          <p className="vendor-portal__empty">You have reached the maximum of 20 items.</p>
        )}
      </div>
    </div>
  );
};

export default VendorPortal;
