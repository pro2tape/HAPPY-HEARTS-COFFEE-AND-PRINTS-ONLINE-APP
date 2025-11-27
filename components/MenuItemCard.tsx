
import React, { useState } from 'react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number, selectedSize?: { name: string; price: number }) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(item.sizes ? item.sizes[0] : undefined);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const currentPrice = selectedSize ? selectedSize.price : item.price;

  return (
    <div className="bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col overflow-hidden">
      {item.image && (
        <div className="h-48 w-full overflow-hidden bg-gray-100">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
        <p className="text-gray-600 mt-2 flex-grow">{item.description}</p>
        
        {item.sizes && item.sizes.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Select Size:</p>
            <div className="flex flex-wrap gap-2">
              {item.sizes.map(size => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 text-sm font-semibold rounded-full border-2 transition-colors ${
                    selectedSize?.name === size.name 
                    ? 'bg-orange-500 text-white border-orange-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-auto pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-amber-800">₱{currentPrice}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="bg-gray-200 text-gray-800 rounded-md p-1 w-8 h-8 flex items-center justify-center font-bold hover:bg-gray-300 transition"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="text-lg font-semibold w-8 text-center" aria-live="polite">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="bg-gray-200 text-gray-800 rounded-md p-1 w-8 h-8 flex items-center justify-center font-bold hover:bg-gray-300 transition"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={() => onAddToCart(item, quantity, selectedSize)}
            className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-full hover:bg-orange-600 transition-colors"
          >
            Add ({quantity}) to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;