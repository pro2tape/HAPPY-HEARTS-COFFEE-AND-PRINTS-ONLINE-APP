import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { CloseIcon } from './Icons';
import { calculateDeliveryFee } from '../utils/location';

interface CheckoutProps {
  cartItems: CartItem[];
  onClose: () => void;
  onSuccess: (order: Order) => void;
  userPosition: GeolocationCoordinates | null;
}


const Checkout: React.FC<CheckoutProps> = ({ cartItems, onClose, onSuccess, userPosition }) => {
  const [customerName, setCustomerName] = useState('');
  
  const subtotal = cartItems.reduce((acc, item) => acc + (item.selectedSize?.price || item.price) * item.quantity, 0);
  const deliveryFee = calculateDeliveryFee(userPosition);
  const total = subtotal + deliveryFee;

  const saveOrderToDatabase = (): Order => {
    const newOrder: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cartItems,
      subtotal,
      deliveryFee,
      total,
      customerName,
      status: 'new',
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


  const handleSendOrder = () => {
    if (!customerName.trim()) {
      alert("Please enter your name for verification.");
      return;
    }

    const newOrder = saveOrderToDatabase();
    onSuccess(newOrder);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold text-amber-900">Checkout</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <CloseIcon className="h-6 w-6" />
            </button>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <div className="max-h-40 overflow-y-auto border-y py-2 mb-4 space-y-2">
          {cartItems.map(item => (
            <div key={item.cartId} className="flex justify-between items-center py-1 text-sm">
              <span>{item.name} {item.selectedSize ? `(${item.selectedSize.name})` : ''} x {item.quantity}</span>
              <span>₱{((item.selectedSize?.price || item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          </div>

          <div className="space-y-2 text-right font-medium">
             <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span>Delivery Fee:</span>
                <span className={userPosition ? '' : 'text-sm text-gray-500'}>
                    {userPosition ? `₱${deliveryFee.toFixed(2)}` : 'Pin location for delivery'}
                </span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                <span>Total:</span>
                <span>₱{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="customerName" className="text-lg font-semibold mb-2 block">Your Name (for verification)</label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="Juan Dela Cruz"
              required
            />
          </div>

        </div>

        <div className="p-4 bg-gray-50 rounded-b-xl">
           <button 
             onClick={handleSendOrder}
             className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-green-300 transition-colors text-lg"
             disabled={!customerName.trim()}
           >
             Place Order
           </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;