import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children, role }) => {
  const vendorToken = localStorage.getItem('vendorAccessToken');
  const customerToken = localStorage.getItem('customerAccessToken');

  if (role === 'vendor' && !vendorToken) {
    return <Navigate to="/login/vendor" />;
  }

  if (role === 'customer' && !customerToken) {
    return <Navigate to="/login/customer" />;
  }

  return children;
};

export default RequireAuth;
