import React, { useState, useEffect } from 'react';
import CustomerApp from './CustomerApp';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    // Initial check
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderRoute = () => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

    switch (route) {
      case '#/admin':
        if (isAuthenticated) {
          return <Admin />;
        }
        // Redirect to login if not authenticated
        window.location.hash = '#/admin/login';
        return <AdminLogin />; // Show login while redirecting
      case '#/admin/login':
        return <AdminLogin />;
      default:
        // Any other hash or no hash will lead to the customer app
        return <CustomerApp />;
    }
  };

  return renderRoute();
};

export default App;
