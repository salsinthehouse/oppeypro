import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children, userType }) => {
  const accessToken = localStorage.getItem('accessToken');
  const idToken = localStorage.getItem('idToken');
  const currentUserType = localStorage.getItem('userType');

  if (!accessToken || !idToken || currentUserType !== userType) {
    return <Navigate to={`/login/${userType}`} />;
  }

  return children;
};

export default RequireAuth;
