import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children, role }) => {
  const vendorToken = localStorage.getItem('vendorAccessToken') || localStorage.getItem('vendorToken');
  const customerToken = localStorage.getItem('customerAccessToken');
  const adminToken = localStorage.getItem('adminToken');

  if (role === 'vendor' && !vendorToken) {
    return <Navigate to="/login/vendor" />;
  }

  if (role === 'customer' && !customerToken) {
    return <Navigate to="/login/customer" />;
  }

  if (role === 'admin' && !adminToken) {
    return <Navigate to="/login/admin" />;
  }

  return children;
};

export default RequireAuth;
