import React, { useState } from 'react';

const StaffSignup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3 || password.trim().length < 4) {
        setError("Username must be at least 3 characters and password at least 4 characters.");
        return;
    }

    const staffAccountsRaw = localStorage.getItem('staffAccounts');
    const staffAccounts = staffAccountsRaw ? JSON.parse(staffAccountsRaw) : [];

    const existingAccount = staffAccounts.find((acc: any) => acc.username === username);

    if (existingAccount) {
      setError('Username already exists. Please choose another one.');
    } else {
      const newAccount = { username, password };
      const updatedAccounts = [...staffAccounts, newAccount];
      localStorage.setItem('staffAccounts', JSON.stringify(updatedAccounts));

      // Log the user in immediately after signup
      localStorage.setItem('isStaffAuthenticated', 'true');
      localStorage.setItem('currentStaffUser', username);
      window.location.hash = '#/staff';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Staff Sign Up</h1>
        <form onSubmit={handleSignup}>
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
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex flex-col gap-4 items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Create Account
            </button>
            <a href="#/staff/login" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Already have an account? Log In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffSignup;
