import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import VendorCallback from './pages/VendorCallback';

import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Cart from './pages/Cart';
import SubscribePage from './pages/SubscribePage';

import CustomerAuth from './pages/CustomerAuth';
import VendorLoginRedirect from './pages/VendorLoginRedirect';

import ConfirmAccount from './pages/ConfirmAccount';
import VendorDashboard from './pages/VendorDashboard';
import RequireAuth from './components/RequireAuth';

import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

import CustomerLoginRedirect from './pages/CustomerLoginRedirect';
import CustomerCallback from './pages/CustomerCallback';
import CustomerDashboard from './pages/CustomerDashboard';

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

        {/* Subscription */}
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/subscribe-success" element={<h2>✅ Subscription successful!</h2>} />
        <Route path="/subscribe-cancel" element={<h2>❌ Subscription cancelled.</h2>} />

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

        {/* Customer */}
        <Route path="/customer/auth" element={<CustomerLoginRedirect />} />
        <Route
          path="/customer/dashboard"
          element={
            <RequireAuth role="customer">
              <CustomerDashboard />
            </RequireAuth>
          }
        />

        <Route path="/confirm" element={<ConfirmAccount />} />

        {/* Vendor */}
        <Route path="/vendor/auth" element={<VendorLoginRedirect />} />
        <Route
          path="/vendor/dashboard"
          element={
            <RequireAuth role="vendor">
              <VendorDashboard />
            </RequireAuth>
          }
        />
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
