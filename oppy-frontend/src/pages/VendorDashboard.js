import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
} from '@mui/material';
import axios from '../config/api';
import AddItemForm from '../components/AddItemForm';
import '../styles/VendorDashboard.css';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login/vendor');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [navigate]);

  const fetchItems = useCallback(async (pageToLoad = 1) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/vendors/items', {
        params: { page: pageToLoad, limit: 20 }
      });
      
      if (pageToLoad === 1) {
        setItems(response.data.items);
      } else {
        setItems(prev => [...prev, ...response.data.items]);
      }
      setTotal(response.data.total);
      setPage(pageToLoad);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        navigate('/login/vendor');
      } else {
        setError('Failed to fetch items. Please try again.');
        console.error('Error fetching items:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchItems(1);
  }, [fetchItems]);

  const handleAddItem = async (itemData) => {
    try {
      const response = await axios.post('/api/vendors/items', itemData);
      // Prepend the new item to the list
      setItems(prev => [response.data, ...prev]);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        navigate('/login/vendor');
      } else {
        setError('Failed to add item. Please try again.');
        console.error('Error adding item:', err);
      }
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleEditItem = async (itemData) => {
    try {
      const response = await axios.put(`/api/vendors/items/${selectedItem._id}`, itemData);
      // Update the item in the list
      setItems(prev => prev.map(item => 
        item._id === selectedItem._id ? response.data.item : item
      ));
      setSelectedItem(null);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        navigate('/login/vendor');
      } else {
        setError('Failed to update item. Please try again.');
        console.error('Error updating item:', err);
      }
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/vendors/items/${itemId}`);
        // After deleting an item, reload the first page
        await fetchItems(1);
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          navigate('/login/vendor');
        } else {
          console.error('Error deleting item:', err);
          setError('Failed to delete item. Please try again.');
        }
      }
    }
  };

  if (loading && items.length === 0) {
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
        </Box>

        {error && (
          <Alert severity="error" className="error-alert">
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {selectedItem ? 'Edit Item' : 'Add New Item'}
          </Typography>
          <AddItemForm 
            onAdd={selectedItem ? handleEditItem : handleAddItem}
            initialData={selectedItem}
            onCancel={() => setSelectedItem(null)}
          />
        </Box>

        <Typography variant="h5" sx={{ mb: 2 }}>Your Listings</Typography>
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
                      onClick={() => setSelectedItem(item)}
                      sx={{ mr: 1 }}
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

        {/* Load More Button */}
        {items.length < total && (
          <Box className="load-more-container" mt={4} mb={4} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => fetchItems(page + 1)}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default VendorDashboard;