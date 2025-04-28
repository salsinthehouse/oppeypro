import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';

const API_URL = isDevelopment
  ? 'http://localhost:5000'
  : 'https://oppy.co.nz';

// Create axios instance with default config
const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance; 