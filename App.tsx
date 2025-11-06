import React, { useState, useEffect } from 'react';
import CustomerApp from './CustomerApp';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';
import StaffOrder from './components/StaffOrder';
import StaffLogin from './components/StaffLogin';
import StaffSignup from './components/StaffSignup';
import OrderQueue from './components/OrderQueue';
import KioskApp from './KioskApp';
import OrderDetailPage from './components/OrderDetailPage';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderRoute = () => {
    const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    const isStaffAuthenticated = localStorage.getItem('isStaffAuthenticated') === 'true';

    // Special route for viewing a single order, accessible by staff and admin
    if (route.startsWith('#/order/')) {
        if (isAdminAuthenticated || isStaffAuthenticated) {
            return <OrderDetailPage />;
        }
        // If not authenticated, redirect to a login page. Admin login is a safe default.
        window.location.hash = '#/admin/login';
        return <AdminLogin />;
    }

    // Kiosk route
    if (route === '#/kiosk') {
      return <KioskApp />;
    }

    // Staff routes
    if (route.startsWith('#/staff')) {
      if (route === '#/staff/login') return <StaffLogin />;
      if (route === '#/staff/signup') return <StaffSignup />;
      
      if (isStaffAuthenticated) {
        if (route === '#/staff') return <StaffOrder />;
        if (route === '#/staff/orders') return <OrderQueue />;
      }
      // If not authenticated for a protected staff route, redirect to staff login
      window.location.hash = '#/staff/login';
      return <StaffLogin />;
    }

    // Admin routes
    if (route.startsWith('#/admin')) {
      if (route === '#/admin/login') return <AdminLogin />;
      
      if (isAdminAuthenticated) {
        if (route === '#/admin') return <Admin />;
        if (route === '#/admin/orders') return <OrderQueue />;
      }
      // If not authenticated for a protected admin route, redirect to admin login
      window.location.hash = '#/admin/login';
      return <AdminLogin />;
    }

    // Default to customer app
    return <CustomerApp />;
  };

  return renderRoute();
};

export default App;