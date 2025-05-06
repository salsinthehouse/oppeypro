import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';

const AddItemForm = ({ onAdd, initialData, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    images: []
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with initialData if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        location: initialData.location || '',
        images: initialData.images || []
      });
    }
  }, [initialData]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      // Upload each file individually
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('image', file);

          try {
            console.log('📤 Uploading file:', file.name);
            const res = await axios.post(
              'http://localhost:5000/api/vendors/upload',
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              }
            );

            console.log('📥 Upload response:', res.data);
            const relativeUrl = res.data.url;
            
            // Verify the response is a relative path
            if (!relativeUrl.startsWith('/uploads/')) {
              throw new Error(`Invalid upload response format: ${relativeUrl}`);
            }

            // Convert to full URL
            const fullUrl = `http://localhost:5000${relativeUrl}`;
            console.log('🖼️ Full image URL:', fullUrl);
            
            // Test the image URL
            const testImg = new Image();
            testImg.onload = () => console.log('✅ Image loaded successfully');
            testImg.onerror = () => console.error('❌ Failed to load image');
            testImg.src = fullUrl;

            return fullUrl;
          } catch (uploadErr) {
            console.error('❌ Error uploading file:', file.name, uploadErr.response?.data || uploadErr.message);
            throw uploadErr;
          }
        })
      );

      console.log('✅ All files uploaded:', uploadedUrls);
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (err) {
      console.error('❌ Error uploading images:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await onAdd(form);
      // Only clear form if we're not editing
      if (!initialData) {
        setForm({
          name: '',
          description: '',
          price: '',
          location: '',
          images: []
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item');
      console.error('Submit error:', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TextField
        name="name"
        label="Item Name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />

      <TextField
        name="description"
        label="Description"
        value={form.description}
        onChange={handleChange}
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
        value={form.price}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />

      <TextField
        name="location"
        label="Location"
        value={form.location}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />

      {/* Image upload section */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Upload Images
        </Typography>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            variant="outlined"
            component="span"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Uploading...' : 'Select Images'}
          </Button>
        </label>

        {/* Image previews */}
        {form.images.length > 0 && (
          <Grid container spacing={1} sx={{ mt: 2 }}>
            {form.images.map((url) => {
              // Extract filename from URL for the key
              const filename = url.split('/').pop();
              return (
                <Grid item key={filename}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      border: '1px solid #ddd',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={url}
                      alt={`Preview ${filename}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <Button
                      size="small"
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        minWidth: 'auto',
                        p: 0.5
                      }}
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          images: prev.images.filter(img => img !== url)
                        }));
                      }}
                    >
                      ×
                    </Button>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={uploading}
        >
          {initialData ? 'Update Item' : 'Add Item'}
        </Button>
        {initialData && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            fullWidth
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AddItemForm; 