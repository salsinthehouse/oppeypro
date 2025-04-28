import axios from './axios';
import { isTokenExpired } from '../utils/auth';

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

// Request interceptor to add auth token
instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken && !isTokenExpired(accessToken)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance; 