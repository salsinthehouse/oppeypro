import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Cart from './pages/Cart';

import VendorCallback from './pages/VendorCallback';
import CustomerCallback from './pages/CustomerCallback';

import VendorLoginRedirect from './pages/VendorLoginRedirect';
import CustomerLoginRedirect from './pages/CustomerLoginRedirect';

import ConfirmAccount from './pages/ConfirmAccount';
import VendorDashboard from './pages/VendorDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerHolds from './pages/CustomerHolds';

import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

import RequireAuth from './components/RequireAuth';

function AppWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {isAdminRoute && <AdminNavbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/vendor/callback" element={<VendorCallback />} />
        <Route path="/customer/callback" element={<CustomerCallback />} />

        {/* Customer Pre-login */}
        <Route path="/customer/auth" element={<CustomerLoginRedirect />} />

        {/* Customer Dashboard */}
        <Route
          path="/customer/dashboard"
          element={
            <RequireAuth role="customer">
              <CustomerDashboard />
            </RequireAuth>
          }
        />
        <Route path="/my-holds" element={<CustomerHolds />} />

        {/* Vendor Pre-login */}
        <Route path="/vendor/auth" element={<VendorLoginRedirect />} />

        {/* Vendor Dashboard */}
        <Route
          path="/vendor/dashboard"
          element={
            <RequireAuth role="vendor">
              <VendorDashboard />
            </RequireAuth>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <RequireAuth role="admin">
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route path="/login/admin" element={<AdminLogin />} />

        {/* Account Confirmation */}
        <Route path="/confirm" element={<ConfirmAccount />} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
