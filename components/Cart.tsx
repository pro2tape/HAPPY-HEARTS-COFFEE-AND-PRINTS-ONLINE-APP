
import React from 'react';
import { CartItem } from '../types';
import { CloseIcon, TrashIcon } from './Icons';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, newQuantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const total = cartItems.reduce((acc, item) => acc + (item.selectedSize?.price || item.price) * item.quantity, 0);

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold text-amber-900">My Order</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center mt-8">Your cart is empty.</p>
            ) : (
              <ul>
                {cartItems.map(item => (
                  <li key={item.cartId} className="flex items-center justify-between py-4 border-b last:border-b-0">
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      {item.selectedSize && <p className="text-sm text-gray-500">{item.selectedSize.name}</p>}
                      <p className="text-sm text-gray-600">₱{item.selectedSize?.price || item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number"
                         value={item.quantity}
                         onChange={(e) => onUpdateQuantity(item.cartId, parseInt(e.target.value, 10))}
                         className="w-14 text-center border rounded"
                         min="1"
                       />
                       <button 
                         onClick={() => onRemoveItem(item.cartId)} 
                         className="text-red-500 hover:text-red-700 p-1"
                         aria-label={`Remove ${item.name} from cart`}
                       >
                         <TrashIcon className="w-5 h-5" />
                       </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span>Total:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors text-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;