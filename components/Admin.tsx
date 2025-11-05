import React, { useState } from 'react';
import { menuData } from '../data/menuData';
import SalesReport from './SalesReport';
import TimeLogReport from './TimeLogReport';
import SettingsModal from './SettingsModal';
import { SettingsIcon } from './Icons';

const Admin: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    window.location.hash = '#/admin/login';
    window.location.reload(); // To ensure state is cleared
  };

  const handlePrintMenu = () => {
    const printContents = document.getElementById('printable-menu-content')?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  return (
    <>
      <div className="bg-slate-100 min-h-screen font-sans">
        <header className="bg-slate-800 text-white shadow-md non-printable">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
               <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 rounded-full hover:bg-slate-700 transition-colors"
                  aria-label="Open settings"
                >
                  <SettingsIcon className="w-6 h-6" />
               </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <section className="bg-white p-6 rounded-lg shadow-md mb-8 non-printable border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-700 mb-4">Point of Sale</h2>
              <a
                  href="#/staff"
                  className="inline-block w-full text-center bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition-colors text-xl"
              >
                  Take New Walk-in/Outdoor Order
              </a>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md mb-8 non-printable border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Order Management</h2>
            <a
              href="https://www.facebook.com/messages/t/61574616669270"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors text-lg"
            >
              View Incoming Orders on Messenger
            </a>
            <p className="text-sm text-gray-500 mt-2">New orders from customers will appear in your Facebook Page's inbox.</p>
          </section>

          <SalesReport />

          <TimeLogReport />

          <section className="bg-white p-6 rounded-lg shadow-md mt-8 non-printable border border-slate-200">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-semibold text-slate-700">Menu Quick View</h2>
               <button onClick={handlePrintMenu} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors">Print Menu</button>
            </div>
            <div id="printable-menu-content" className="hidden print:block">
               <h1 className="text-3xl font-bold text-center mb-6">Happy Hearts Menu</h1>
              {Object.entries(menuData).map(([category, items]) => (
                <div key={category} className="mb-6 break-after-page">
                  <h3 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-3">{category}</h3>
                  <ul>
                    {items.map(item => (
                      <li key={item.id} className="flex justify-between py-1">
                        <span>{item.name}{item.sizes ? ` (${item.sizes.map(s => s.name).join(' / ')})` : ''}</span>
                        <span>
                          {item.sizes ? item.sizes.map(s => `P${s.price}`).join(' / ') : `P${item.price}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
    </>
  );
};

export default Admin;
