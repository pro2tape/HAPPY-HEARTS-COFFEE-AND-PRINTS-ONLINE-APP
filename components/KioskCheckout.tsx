import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { CloseIcon } from './Icons';
import { generateNewOrderId } from '../utils/order';

interface KioskCheckoutProps {
  cartItems: CartItem[];
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

const KioskCheckout: React.FC<KioskCheckoutProps> = ({ cartItems, onClose, onSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  
  const subtotal = cartItems.reduce((acc, item) => acc + (item.selectedSize?.price || item.price) * item.quantity, 0);
  const total = subtotal;

  const saveOrderToDatabase = (): Order => {
    const newOrder: Order = {
      id: generateNewOrderId(),
      date: new Date().toISOString(),
      items: cartItems,
      subtotal,
      deliveryFee: 0,
      total,
      customerName: customerName.trim() || 'Kiosk Customer',
      status: 'new',
      staffName: 'Kiosk',
    };

    try {
      const existingOrdersRaw = localStorage.getItem('orders');
      const existingOrders: Order[] = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    } catch (e) {
      console.error("Failed to save order:", e);
    }
    return newOrder;
  };

  const handlePlaceOrder = () => {
    if (!customerName.trim()) {
      alert("Please enter a name for your order.");
      return;
    }
    const newOrder = saveOrderToDatabase();
    onSuccess(newOrder);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-4xl font-bold text-amber-900">Confirm Your Order</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2 rounded-full">
              <CloseIcon className="h-8 w-8" />
            </button>
        </div>
        
        <div className="p-8">
          <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
          <div className="max-h-64 overflow-y-auto border-y py-4 mb-6 space-y-3">
          {cartItems.map(item => (
            <div key={item.cartId} className="flex justify-between items-center py-1 text-lg">
              <span>{item.name} {item.selectedSize ? `(${item.selectedSize.name})` : ''} x {item.quantity}</span>
              <span className="font-semibold">₱{((item.selectedSize?.price || item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          </div>

          <div className="space-y-4 text-right font-medium text-2xl">
            <div className="flex justify-between text-4xl font-bold border-t pt-4 mt-4">
                <span>Total:</span>
                <span>₱{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8">
            <label htmlFor="customerName" className="text-2xl font-semibold mb-3 block">Your Name (for this order)</label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-4 border-2 rounded-lg text-2xl focus:ring-4 focus:ring-amber-500 focus:outline-none"
              placeholder="e.g., Juan"
              required
            />
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-2xl grid grid-cols-2 gap-4">
           <button 
             onClick={onClose}
             className="w-full bg-gray-500 text-white font-bold py-4 rounded-lg hover:bg-gray-600 transition-colors text-2xl"
           >
             Cancel
           </button>
           <button 
             onClick={handlePlaceOrder}
             className="w-full bg-green-500 text-white font-bold py-4 rounded-lg hover:bg-green-600 disabled:bg-green-300 transition-colors text-2xl"
             disabled={!customerName.trim()}
           >
             Confirm & Pay at Counter
           </button>
        </div>
      </div>
    </div>
  );
};

export default KioskCheckout;