// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('../oppy-backend/routes/auth');  // Correctly import auth routes
const storeRoutes = require('../oppy-backend/routes/store');
const itemRoutes = require('../oppy-backend/routes/item');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());  // Parse incoming JSON requests
app.use(cors());  // Enable CORS for frontend to access backend

// Register routes
app.use('/api/auth', authRoutes);  // This will connect the `/api/auth` prefix to `auth.js` routes
app.use('/api/store', storeRoutes);
app.use('/api/item', itemRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
