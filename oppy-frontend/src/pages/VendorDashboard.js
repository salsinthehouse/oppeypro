import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import axios from '../config/api';
import '../styles/VendorDashboard.css';

const VendorDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    images: [],
  });

  const locations = ['Central', 'North', 'South', 'East', 'West'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/public/items/all');
      setItems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch items. Please try again.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        location: item.location,
        images: item.images || [],
      });
    } else {
      setSelectedItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        location: '',
        images: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      location: '',
      images: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...response.data.urls]
      }));
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await axios.put(`/items/${selectedItem._id}`, formData);
      } else {
        await axios.post('/items', formData);
      }
      fetchItems();
      handleCloseDialog();
      setError(null);
    } catch (err) {
      console.error('Error saving item:', err);
      setError('Failed to save item. Please try again.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/items/${itemId}`);
        fetchItems();
        setError(null);
      } catch (err) {
        console.error('Error deleting item:', err);
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <Typography variant="h5">Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <div className="vendor-dashboard">
      <Container maxWidth="lg">
        <Box className="dashboard-header">
          <Typography variant="h4">Vendor Dashboard</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            className="add-item-button"
          >
            Add New Item
          </Button>
        </Box>

        {error && (
          <Alert severity="error" className="error-alert">
            {error}
          </Alert>
        )}

        <Grid container spacing={3} className="items-grid">
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card className="item-card">
                {item.images?.[0] && (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="item-image"
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${item.price}
                  </Typography>
                  <Typography variant="body2">
                    Location: {item.location}
                  </Typography>
                  <Box className="item-actions">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenDialog(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedItem ? 'Edit Item' : 'Add New Item'}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} className="item-form">
              <TextField
                name="name"
                label="Item Name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                required
                multiline
                rows={3}
                margin="normal"
              />
              <TextField
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                name="location"
                label="Location"
                select
                value={formData.location}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              >
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </TextField>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="image-input"
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {selectedItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default VendorDashboard;