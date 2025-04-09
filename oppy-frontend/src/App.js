// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import VendorLogin from './pages/VendorLogin';
import VendorPortal from './pages/VendorPortal';
import RegisterStore from './pages/RegisterStore';
import Cart from './pages/Cart';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import Login from './components/Login'; // Import the new Login component

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
        <Route path="/cart" element={<Cart />} />
        {/* New route for shared Login component */}
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
