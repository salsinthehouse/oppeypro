// File: src/pages/Home.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from '../config/api';
import '../styles/Home.css';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/public/items/all');
        setItems(response.data);
        // Extract unique locations
        const uniqueLocations = [...new Set(response.data.map(item => item.location))];
        setLocations(uniqueLocations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = 
      item.price >= priceRange[0] && item.price <= priceRange[1];
    
    const matchesLocation = 
      !location || item.location === location;

    return matchesSearch && matchesPrice && matchesLocation;
  });

  if (loading) {
    return (
      <Box className="loading-container">
        <Typography variant="h5">Loading items...</Typography>
      </Box>
    );
  }

  return (
    <div className="home-container">
      <section className="hero-section">
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h2" className="hero-title" sx={{ textAlign: 'center' }}>
            Welcome to Oppy
          </Typography>
          <Typography variant="h5" className="hero-subtitle" sx={{ textAlign: 'center' }}>
            Discover Amazing Items from Local Vendors
          </Typography>
        </Container>
      </section>

      <section className="search-section">
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box className="search-filters" sx={{ width: '100%', maxWidth: '800px' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search items..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
              sx={{ textAlign: 'center' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box className="filter-group" sx={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
              <Typography variant="subtitle1" className="filter-label" sx={{ textAlign: 'center' }}>
                Price Range
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                className="price-slider"
              />
            </Box>
            <FormControl fullWidth className="location-select" sx={{ maxWidth: '500px', margin: '0 auto' }}>
              <InputLabel>Location</InputLabel>
              <Select
                value={location}
                onChange={handleLocationChange}
                label="Location"
                sx={{ textAlign: 'center' }}
                startAdornment={
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Locations</MenuItem>
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc} sx={{ textAlign: 'center' }}>{loc}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Container>
      </section>

      <Container maxWidth="lg" className="items-section" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Box className="section-header" sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <Typography variant="h4" className="section-title" sx={{ textAlign: 'center', width: '100%' }}>
            Featured Items
          </Typography>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            className="category-tabs"
            sx={{ 
              width: '100%',
              '& .MuiTabs-flexContainer': {
                justifyContent: 'center',
                gap: '1rem'
              }
            }}
          >
            <Tab label="All Items" sx={{ minWidth: '120px' }} />
            <Tab label="New Arrivals" sx={{ minWidth: '120px' }} />
            <Tab label="Popular" sx={{ minWidth: '120px' }} />
          </Tabs>
        </Box>

        <Grid container spacing={4} sx={{ justifyContent: 'center', width: '100%', marginTop: '2rem' }}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card 
                className="item-card"
                onClick={() => handleItemClick(item._id)}
                sx={{ width: '100%', maxWidth: '320px' }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.images[0] || '/placeholder.jpg'}
                  alt={item.name}
                  className="item-image"
                />
                <CardContent className="item-content" sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" className="item-name" sx={{ textAlign: 'center' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="item-description" sx={{ textAlign: 'center' }}>
                    {item.description}
                  </Typography>
                  <Box className="item-footer" sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <Typography variant="h6" className="item-price" sx={{ textAlign: 'center' }}>
                      ${item.price}
                    </Typography>
                    <Typography variant="body2" className="item-location" sx={{ textAlign: 'center' }}>
                      {item.location}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <section className="cta-section">
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h3" className="cta-title" sx={{ textAlign: 'center' }}>
            Are you a vendor?
          </Typography>
          <Typography variant="h6" className="cta-subtitle" sx={{ textAlign: 'center' }}>
            Join our platform and start selling today
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => navigate('/vendor/register')}
            className="cta-button"
            sx={{ margin: '0 auto' }}
          >
            Become a Vendor
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default Home;
