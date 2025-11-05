import React, { useState, useEffect } from 'react';
import { CloseIcon, CopyIcon, TrashIcon, PrintIcon } from './Icons';
import { StaffAccount } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Staff accounts state
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>([]);

  // Link copy states
  const [isStaffLinkCopied, setIsStaffLinkCopied] = useState(false);
  const [isKioskLinkCopied, setIsKioskLinkCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load staff accounts when modal opens
      const storedAccounts = localStorage.getItem('staffAccounts');
      if (storedAccounts) {
        setStaffAccounts(JSON.parse(storedAccounts));
      }
      // Reset form states
      setPasswordError('');
      setPasswordSuccess('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen]);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const adminCredsRaw = localStorage.getItem('adminCredentials');
    if (!adminCredsRaw) {
      setPasswordError('Could not find admin credentials.');
      return;
    }
    const adminCreds = JSON.parse(adminCredsRaw);

    if (adminCreds.password !== currentPassword) {
      setPasswordError('Current password does not match.');
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError('New password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    const updatedCreds = { ...adminCreds, password: newPassword };
    localStorage.setItem('adminCredentials', JSON.stringify(updatedCreds));
    setPasswordSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteStaff = (usernameToDelete: string) => {
    if (window.confirm(`Are you sure you want to delete the staff account "${usernameToDelete}"?`)) {
      const updatedAccounts = staffAccounts.filter(acc => acc.username !== usernameToDelete);
      setStaffAccounts(updatedAccounts);
      localStorage.setItem('staffAccounts', JSON.stringify(updatedAccounts));
    }
  };

  const staffLink = `${window.location.origin}${window.location.pathname.replace(/index\.html$/, '')}#/staff/login`;
  const kioskLink = `${window.location.origin}${window.location.pathname.replace(/index\.html$/, '')}#/kiosk`;
  const customerLink = `${window.location.origin}${window.location.pathname.replace(/index\.html$/, '')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(customerLink)}`;


  const handleCopyStaffLink = () => {
    navigator.clipboard.writeText(staffLink).then(() => {
        setIsStaffLinkCopied(true);
        setTimeout(() => setIsStaffLinkCopied(false), 2500);
    });
  };

  const handleCopyKioskLink = () => {
    navigator.clipboard.writeText(kioskLink).then(() => {
        setIsKioskLinkCopied(true);
        setTimeout(() => setIsKioskLinkCopied(false), 2500);
    });
  };

  const handlePrintQrCode = () => {
    const printContents = document.getElementById('printable-qr-code')?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
        document.body.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
                ${printContents}
            </div>
        `;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8">
          {/* Change Password Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Change Admin Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"
                required
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-600 text-sm">{passwordSuccess}</p>}
              <button type="submit" className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors">
                Update Password
              </button>
            </form>
          </div>

          {/* Staff Access Link Section */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Staff Access Link</h3>
            <p className="text-sm text-gray-600 mb-4">Share this link with your staff so they can sign up and log in to the order entry system.</p>
            <div className="flex gap-2">
                <input
                    type="text"
                    readOnly
                    value={staffLink}
                    className="w-full p-2 border rounded-lg bg-gray-100 text-gray-700 focus:outline-none"
                />
                <button
                    onClick={handleCopyStaffLink}
                    className={`flex items-center gap-2 justify-center w-32 font-bold py-2 px-4 rounded-lg transition-colors ${
                        isStaffLinkCopied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-slate-600 text-white hover:bg-slate-700'
                    }`}
                >
                    {isStaffLinkCopied ? 'Copied!' : <><CopyIcon className="w-5 h-5" /> Copy</>}
                </button>
            </div>
          </div>

          {/* Kiosk Access Link Section */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Kiosk App Link</h3>
            <p className="text-sm text-gray-600 mb-4">Share this link to open the self-service kiosk ordering system on a dedicated device.</p>
            <div className="flex gap-2">
                <input
                    type="text"
                    readOnly
                    value={kioskLink}
                    className="w-full p-2 border rounded-lg bg-gray-100 text-gray-700 focus:outline-none"
                />
                <button
                    onClick={handleCopyKioskLink}
                    className={`flex items-center gap-2 justify-center w-32 font-bold py-2 px-4 rounded-lg transition-colors ${
                        isKioskLinkCopied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-slate-600 text-white hover:bg-slate-700'
                    }`}
                >
                    {isKioskLinkCopied ? 'Copied!' : <><CopyIcon className="w-5 h-5" /> Copy</>}
                </button>
            </div>
          </div>

          {/* Dine-in QR Code Section */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Dine-in Customer QR Code</h3>
            <p className="text-sm text-gray-600 mb-4">Print this QR code and display it on tables. Customers can scan it to open the menu and place their order directly from their phone.</p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div id="printable-qr-code" className="text-center p-4 border rounded-lg">
                    <img src={qrCodeUrl} alt="Dine-in Order QR Code" width="200" height="200" className="mx-auto" />
                    <p className="font-bold text-lg mt-2">Scan to Order</p>
                    <p className="text-sm text-gray-600">Happy Hearts Coffee & Prints</p>
                </div>
                <button
                    onClick={handlePrintQrCode}
                    className="flex items-center gap-2 justify-center font-bold py-2 px-4 rounded-lg bg-slate-600 text-white hover:bg-slate-700 transition-colors"
                >
                    <PrintIcon className="w-5 h-5" />
                    Print QR Code
                </button>
            </div>
          </div>


          {/* Staff Accounts Section */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Staff Accounts</h3>
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              {staffAccounts.length > 0 ? (
                <ul className="divide-y">
                  {staffAccounts.map(account => (
                    <li key={account.username} className="flex justify-between items-center p-3">
                      <span className="font-medium text-gray-700">{account.username}</span>
                      <button
                        onClick={() => handleDeleteStaff(account.username)}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label={`Delete account ${account.username}`}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-4 text-center text-gray-500">No staff accounts have been created yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-b-xl mt-auto">
          <button onClick={onClose} className="w-full bg-gray-500 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;