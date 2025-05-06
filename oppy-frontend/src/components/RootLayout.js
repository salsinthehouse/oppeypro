import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const RootLayout = () => {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout; 