import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import RegisterStore from './pages/RegisterStore';
import VendorLogin from './pages/VendorLogin';
import VendorPortal from './pages/VendorPortal';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/customer" element={<CustomerLogin />} />
        <Route path="/register/customer" element={<CustomerRegister />} />
        <Route path="/register/store" element={<RegisterStore />} />
        <Route path="/login/vendor" element={<VendorLogin />} />
        <Route path="/vendor" element={<VendorPortal />} />
        <Route path="/account" element={<div>My Account (Coming Soon)</div>} />
        <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
