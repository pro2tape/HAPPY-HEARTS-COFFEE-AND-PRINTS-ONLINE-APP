import React from 'react';
import { Order } from '../types';
import { MessengerIcon } from './Icons';
import { generateOrderMessage, FACEBOOK_PAGE_ID } from '../utils/messaging';

interface StaffOrderConfirmationModalProps {
  order: Order;
  onClose: () => void;
}

const StaffOrderConfirmationModal: React.FC<StaffOrderConfirmationModalProps> = ({ order, onClose }) => {

  const handleSendToMessenger = () => {
    const message = generateOrderMessage(order);
    const encodedMessage = encodeURIComponent(message);
    const messengerLink = `https://m.me/${FACEBOOK_PAGE_ID}?text=${encodedMessage}`;
    window.open(messengerLink, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm text-center">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Order Placed!</h2>
          <p className="text-gray-600 mb-4">The order has been sent to the queue. You can now send it to the kitchen via Messenger.</p>
          <div className="bg-gray-100 rounded-lg p-4 my-6">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-4xl font-bold font-mono text-amber-900 tracking-wider">{order.id}</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-b-xl space-y-3">
           <button 
             onClick={handleSendToMessenger}
             className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg flex items-center justify-center gap-2"
           >
             <MessengerIcon className="w-6 h-6" />
             Send to Kitchen (Messenger)
           </button>
           <button 
             onClick={onClose}
             className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors text-lg"
           >
             New Order
           </button>
        </div>
      </div>
    </div>
  );
};

export default StaffOrderConfirmationModal;
