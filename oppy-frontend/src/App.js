import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CustomerLogin from './pages/CustomerLogin';
import CustomerLoginRedirect from './pages/CustomerLoginRedirect';
import VendorLogin from './pages/VendorLogin';
import VendorLoginRedirect from './pages/VendorLoginRedirect';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<CustomerLoginRedirect />} />
        <Route path="/customer/callback" element={<CustomerLogin />} />
        <Route path="/vendor/login" element={<VendorLoginRedirect />} />
        <Route path="/vendor/callback" element={<VendorLogin />} />

        {/* Customer Routes */}
        <Route 
          path="/customer/dashboard" 
          element={
            <RequireAuth userType="customer">
              <CustomerDashboard />
            </RequireAuth>
          } 
        />

        {/* Vendor Routes */}
        <Route 
          path="/vendor/dashboard" 
          element={
            <RequireAuth userType="vendor">
              <VendorDashboard />
            </RequireAuth>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <RequireAuth userType="admin">
              <AdminDashboard />
            </RequireAuth>
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
