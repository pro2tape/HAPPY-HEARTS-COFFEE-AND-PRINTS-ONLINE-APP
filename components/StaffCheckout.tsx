
import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { CloseIcon } from './Icons';
import { generateNewOrderId } from '../utils/order';

interface StaffCheckoutProps {
  cartItems: CartItem[];
  onCancel: () => void;
  onSuccess: (order: Order) => void;
  staffName: string;
}

const StaffCheckout: React.FC<StaffCheckoutProps> = ({ cartItems, onCancel, onSuccess, staffName }) => {
  const [orderTimeType, setOrderTimeType] = useState<'now' | 'later'>('now');
  const [scheduledTime, setScheduledTime] = useState('');
  const [orderType, setOrderType] = useState<'walk-in' | 'messenger'>('walk-in');

  // Messenger-specific state
  const [messengerName, setMessengerName] = useState('');
  const [messengerContact, setMessengerContact] = useState('');
  const [deliveryFeeInput, setDeliveryFeeInput] = useState('0');
  
  const subtotal = cartItems.reduce((acc, item) => acc + (item.selectedSize?.price || item.price) * item.quantity, 0);
  const deliveryFee = orderType === 'messenger' ? parseFloat(deliveryFeeInput) || 0 : 0;
  const total = subtotal + deliveryFee;

  const saveOrderToDatabase = (): Order => {
    const deliveryTime = orderTimeType === 'now' ? 'ASAP' : scheduledTime;

    const newOrder: Order = {
      id: generateNewOrderId(),
      date: new Date().toISOString(),
      items: cartItems,
      subtotal,
      deliveryFee,
      total,
      customerName: 'Walk-in',
      deliveryTime,
      staffName,
      status: 'new',
      isMessengerDelivery: orderType === 'messenger',
      messengerName: orderType === 'messenger' ? messengerName : undefined,
      messengerContact: orderType === 'messenger' ? messengerContact : undefined,
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
    if (orderTimeType === 'later' && !scheduledTime) {
        alert("Please select a time for the scheduled order.");
        return;
    }
    if (orderType === 'messenger' && (!messengerName.trim() || !messengerContact.trim())) {
        alert("Please fill in all messenger details.");
        return;
    }

    const newOrder = saveOrderToDatabase();
    onSuccess(newOrder);
  };

  const isButtonDisabled = (orderTimeType === 'later' && !scheduledTime) ||
                           (orderType === 'messenger' && (!messengerName.trim() || !messengerContact.trim()));
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold text-amber-900">Finalize Order</h2>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-800">
              <CloseIcon className="h-6 w-6" />
            </button>
        </div>
        
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <div className="max-h-32 overflow-y-auto border-y py-2 mb-4 space-y-2">
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
             {orderType === 'messenger' && (
                <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>₱{deliveryFee.toFixed(2)}</span>
                </div>
             )}
            <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                <span>Total:</span>
                <span>₱{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-lg font-semibold mb-2 block">Order Type</label>
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setOrderType('walk-in')}
                    className={`w-full p-2 rounded-lg font-semibold transition-colors ${orderType === 'walk-in' ? 'bg-amber-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    Walk-in / Take-out
                </button>
                <button
                    onClick={() => setOrderType('messenger')}
                    className={`w-full p-2 rounded-lg font-semibold transition-colors ${orderType === 'messenger' ? 'bg-amber-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    Messenger Delivery
                </button>
            </div>
          </div>
           
           {orderType === 'messenger' && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-4">
                <h4 className="font-semibold text-md text-gray-700">Messenger Details</h4>
                 <input
                    type="text"
                    value={messengerName}
                    onChange={(e) => setMessengerName(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g., Grab, Lalamove"
                    required
                />
                 <input
                    type="text"
                    value={messengerContact}
                    onChange={(e) => setMessengerContact(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Contact or Booking #"
                    required
                />
                 <div className="flex items-center gap-2">
                    <label htmlFor="deliveryFee" className="font-medium">Delivery Fee (₱):</label>
                    <input
                        id="deliveryFee"
                        type="number"
                        value={deliveryFeeInput}
                        onChange={(e) => setDeliveryFeeInput(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        placeholder="e.g., 59"
                        required
                    />
                </div>
            </div>
           )}

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
        </div>

        <div className="p-4 bg-gray-50 rounded-b-xl">
           <button 
             onClick={handleSendOrder}
             className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-green-300 transition-colors text-lg"
             disabled={isButtonDisabled}
           >
             Send Order to Kitchen
           </button>
        </div>
      </div>
    </div>
  );
};

export default StaffCheckout;
