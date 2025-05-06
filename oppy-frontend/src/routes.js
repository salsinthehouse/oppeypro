import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import CustomerLogin from './pages/CustomerLogin';
import VendorLogin from './pages/VendorLogin';
import CognitoCallback from './pages/CognitoCallback';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requiredUserType }) => {
  const { token, userType } = useContext(AuthContext);
  const storedToken = localStorage.getItem('token');
  const storedUserType = localStorage.getItem('userType');

  // Use both context and localStorage values to ensure we have the latest state
  const isAuthenticated = (token || storedToken) && (userType || storedUserType) === requiredUserType;

  if (!isAuthenticated) {
    return <Navigate to={`/login/${requiredUserType}`} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login/customer" element={<CustomerLogin />} />
      <Route path="/login/vendor" element={<VendorLogin />} />
      <Route path="/auth/callback" element={<CognitoCallback />} />

      {/* Protected Routes */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute requiredUserType="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/dashboard"
        element={
          <ProtectedRoute requiredUserType="vendor">
            <VendorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredUserType="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 