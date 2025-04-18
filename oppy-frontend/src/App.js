import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Cart from './pages/Cart';

import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';

import VendorLogin from './pages/VendorLogin';
import VendorPortal from './pages/VendorPortal';
import RegisterStore from './pages/RegisterStore';

import RequireAuth from './components/RequireAuth';
import ConfirmAccount from './pages/ConfirmAccount';

import VendorDashboard from './pages/VendorDashboard';
import SubscribePage from './pages/SubscribePage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />

        {/* Subscription */}
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/subscribe-success" element={<h2>✅ Subscription successful!</h2>} />
        <Route path="/subscribe-cancel" element={<h2>❌ Subscription cancelled.</h2>} />

        {/* Customer */}
        <Route path="/login/customer" element={<CustomerLogin />} />
        <Route path="/register/customer" element={<CustomerRegister />} />

        <Route path="/confirm" element={<ConfirmAccount />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />

        {/* Vendor */}
        <Route path="/login/vendor" element={<VendorLogin />} />
        <Route path="/register/store" element={<RegisterStore />} />
        <Route
          path="/vendor/dashboard"
          element={
            <RequireAuth role="vendor">
              <VendorPortal />
            </RequireAuth>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
