import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RegisterStore from './pages/RegisterStore';
import VendorLogin from './pages/VendorLogin';
import VendorPortal from './pages/VendorPortal';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/store" element={<RegisterStore />} />
        <Route path="/login/vendor" element={<VendorLogin />} />
        <Route path="/vendor" element={<VendorPortal />} />
        {/* Placeholder routes for future pages */}
        <Route path="/login/customer" element={<div>Login as Customer (Coming Soon)</div>} />
        <Route path="/account" element={<div>My Account (Coming Soon)</div>} />
        <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
