
import React from 'react';
import { CartItem, Order } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import { CloseIcon } from './Icons';

interface CheckoutProps {
  cartItems: CartItem[];
  onClose: () => void;
}

// Store's location (4C93+Q9X, Zarate St, San Fabian, Pangasinan)
const STORE_LOCATION = { latitude: 16.1194375, longitude: 120.4034375 };

// Haversine formula to calculate distance between two lat/lon points in km
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};


const Checkout: React.FC<CheckoutProps> = ({ cartItems, onClose }) => {
  const { position, loading, error, getLocation } = useGeolocation();
  
  const subtotal = cartItems.reduce((acc, item) => acc + (item.selectedSize?.price || item.price) * item.quantity, 0);

  let deliveryFee = 0;
  if (position) {
      const distance = getDistance(
          STORE_LOCATION.latitude,
          STORE_LOCATION.longitude,
          position.latitude,
          position.longitude
      );
      // Delivery fee logic: P40 base fee for first 3km, then P10 for each additional km.
      if (distance <= 3) {
          deliveryFee = 40;
      } else {
          deliveryFee = 40 + Math.round((distance - 3) * 10);
      }
  }

  const total = subtotal + deliveryFee;

  const saveOrderToDatabase = () => {
    const newOrder: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cartItems,
      subtotal,
      deliveryFee,
      total,
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
    if (!position) {
      alert("Please pin your location before sending the order.");
      return;
    }

    const orderItemsText = cartItems.map(item => 
        `${item.quantity}x ${item.name} ${item.selectedSize ? `(${item.selectedSize.name})` : ''} - ₱${((item.selectedSize?.price || item.price) * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `
--- NEW ONLINE ORDER ---

${orderItemsText}
------------------------------------
Subtotal: ₱${subtotal.toFixed(2)}
Delivery Fee: ₱${deliveryFee.toFixed(2)}
*TOTAL: ₱${total.toFixed(2)}*
------------------------------------

*Delivery Location:*
https://www.google.com/maps?q=${position.latitude},${position.longitude}

(This is an automated order message. Please confirm receipt.)
    `.trim().replace(/^\s+/gm, '');

    const encodedMessage = encodeURIComponent(message);
    const facebookPageId = '61574616669270'; 
    const messengerUrl = `https://m.me/${facebookPageId}?text=${encodedMessage}`;
    
    saveOrderToDatabase();

    window.open(messengerUrl, '_blank');
    alert("Your order is ready to be sent! Please click 'Send' in the new Messenger tab that just opened.");
    onClose();
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
            <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>{position ? `₱${deliveryFee.toFixed(2)}` : 'Set location'}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                <span>Total:</span>
                <span>₱{total.toFixed(2)}</span>
            </div>
          </div>


          <h3 className="text-lg font-semibold mb-2 mt-6">Delivery Location</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            {position ? (
              <div className="text-green-700">
                <p className="font-semibold">Location Pinned!</p>
                <p className="text-xs">Lat: {position.latitude.toFixed(5)}, Lon: {position.longitude.toFixed(5)}</p>
              </div>
            ) : (
              <p className="text-gray-600">
                {loading ? 'Getting your location...' : 'Please pin your location for delivery.'}
              </p>
            )}
            {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
             <button onClick={getLocation} disabled={loading} className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors">
              {loading ? 'Loading...' : 'Pin My Current Location'}
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-b-xl">
           <button 
             onClick={handleSendOrder}
             className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-green-300 transition-colors text-lg"
             disabled={!position || loading}
           >
             Send Order via Messenger
           </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
