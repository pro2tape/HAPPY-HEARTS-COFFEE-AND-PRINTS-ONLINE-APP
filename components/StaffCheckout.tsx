import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { CloseIcon } from './Icons';

interface StaffCheckoutProps {
  cartItems: CartItem[];
  onClose: () => void;
  staffName: string;
}

const StaffCheckout: React.FC<StaffCheckoutProps> = ({ cartItems, onClose, staffName }) => {
  const [customerIdentifier, setCustomerIdentifier] = useState('');
  const [orderTimeType, setOrderTimeType] = useState<'now' | 'later'>('now');
  const [scheduledTime, setScheduledTime] = useState('');
  
  const subtotal = cartItems.reduce((acc, item) => acc + (item.selectedSize?.price || item.price) * item.quantity, 0);
  const deliveryFee = 0; // No delivery fee for staff-entered orders
  const total = subtotal + deliveryFee;

  const saveOrderToDatabase = () => {
    const deliveryTime = orderTimeType === 'now' ? 'ASAP' : scheduledTime;

    const newOrder: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cartItems,
      subtotal,
      deliveryFee,
      total,
      customerName: customerIdentifier.trim() || 'Walk-in', // Use identifier as customer name
      deliveryTime,
      staffName,
    };

    try {
      const existingOrdersRaw = localStorage.getItem('orders');
      const existingOrders: Order[] = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    } catch (e) {
      console.error("Failed to save order:", e);
    }
  };

  const handleSendOrder = () => {
    if (!customerIdentifier.trim()) {
      alert("Please enter a customer name or table number.");
      return;
    }
    if (orderTimeType === 'later' && !scheduledTime) {
        alert("Please select a time for the scheduled order.");
        return;
    }

    const deliveryTimeText = orderTimeType === 'now' ? 'ASAP' : scheduledTime;

    const orderItemsText = cartItems.map(item => 
        `${item.quantity}x ${item.name} ${item.selectedSize ? `(${item.selectedSize.name})` : ''} - ₱${((item.selectedSize?.price || item.price) * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `
--- NEW STAFF-ENTERED ORDER ---

*Taken by: ${staffName}*
*Customer/Table: ${customerIdentifier.trim()}*
*Order Time: ${deliveryTimeText}*

${orderItemsText}
------------------------------------
*TOTAL: ₱${total.toFixed(2)}*
------------------------------------

(This is a staff-entered order. Please prepare.)
    `.trim().replace(/^\s+/gm, '');

    const encodedMessage = encodeURIComponent(message);
    const facebookPageId = '61574616669270'; 
    const messengerUrl = `https://m.me/${facebookPageId}?text=${encodedMessage}`;
    
    saveOrderToDatabase();

    window.open(messengerUrl, '_blank');
    alert("The order is ready to be sent! Please click 'Send' in the new Messenger tab that just opened.");
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold text-amber-900">Finalize Order</h2>
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
            <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                <span>Total:</span>
                <span>₱{total.toFixed(2)}</span>
            </div>
          </div>
           
          <div className="mt-6">
            <label className="text-lg font-semibold mb-2 block">Order Time</label>
            <div className="flex gap-2 mb-2">
                <button
                    onClick={() => setOrderTimeType('now')}
                    className={`w-full p-2 rounded-lg font-semibold transition-colors ${orderTimeType === 'now' ? 'bg-amber-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    ASAP (Now)
                </button>
                <button
                    onClick={() => setOrderTimeType('later')}
                    className={`w-full p-2 rounded-lg font-semibold transition-colors ${orderTimeType === 'later' ? 'bg-amber-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    Schedule for Later
                </button>
            </div>
            {orderTimeType === 'later' && (
                <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                />
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="customerIdentifier" className="text-lg font-semibold mb-2 block">Customer Name / Table #</label>
            <input
              type="text"
              id="customerIdentifier"
              value={customerIdentifier}
              onChange={(e) => setCustomerIdentifier(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="e.g., Table 5 or Maria"
              required
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-b-xl">
           <button 
             onClick={handleSendOrder}
             className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-green-300 transition-colors text-lg"
             disabled={!customerIdentifier.trim() || (orderTimeType === 'later' && !scheduledTime)}
           >
             Send Order to Kitchen
           </button>
        </div>
      </div>
    </div>
  );
};

export default StaffCheckout;