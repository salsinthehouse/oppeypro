import axios from '../config/axios';

// Function to check if token is expired or about to expire
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    return now >= expiry - 300000; // Consider expired if within 5 minutes of expiry
  } catch (err) {
    return true;
  }
};

// Function to refresh tokens
export const refreshTokens = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post('/api/auth/refresh', {
      refreshToken
    });

    const { accessToken, idToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('idToken', idToken);

    return { accessToken, idToken };
  } catch (err) {
    console.error('Token refresh error:', err);
    localStorage.clear();
    window.location.href = '/login';
    throw err;
  }
};

// Axios interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken } = await refreshTokens();
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Function to clear all auth-related data
export const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userType');
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem('accessToken');
  return !isTokenExpired(accessToken);
};

// Function to get the current user type
export const getUserType = () => {
  return localStorage.getItem('userType');
}; 