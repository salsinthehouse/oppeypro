// File: src/pages/CustomerLogin.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/api';
import { 
  Button, 
  Container, 
  Typography, 
  TextField,
  Box,
  Alert
} from '@mui/material';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      const { tokens } = response.data;
      localStorage.setItem('accessToken', tokens.AccessToken);
      localStorage.setItem('idToken', tokens.IdToken);
      localStorage.setItem('userType', 'customer');
      
      navigate('/customer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>Customer Login</Typography>
      
      <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        
        <Button 
          type="submit"
          variant="contained" 
          color="primary"
          sx={{ mt: 2 }}
          disabled={loading}
          fullWidth
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Container>
  );
};

export default CustomerLogin;
