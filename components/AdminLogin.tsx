import React, { useState, useEffect } from 'react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // On first load, check if an admin account exists. If not, create a default one.
    const adminCreds = localStorage.getItem('adminCredentials');
    if (!adminCreds) {
      const defaultAdmin = { username: 'admin', password: 'password' };
      localStorage.setItem('adminCredentials', JSON.stringify(defaultAdmin));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminCredsRaw = localStorage.getItem('adminCredentials');
    if (!adminCredsRaw) {
        setError('Admin account not found. Please contact support.');
        return;
    }
    const adminCreds = JSON.parse(adminCredsRaw);

    if (username === adminCreds.username && password === adminCreds.password) {
      localStorage.setItem('isAdminAuthenticated', 'true');
      window.location.hash = '#/admin';
      window.location.reload();
    } else {
      setError('Invalid username or password');
      localStorage.removeItem('isAdminAuthenticated');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
