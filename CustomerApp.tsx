import React, { useState, useMemo } from 'react';
import { CartItem, MenuItem } from './types';
import { menuData } from './data/menuData';
import MenuItemCard from './components/MenuItemCard';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import GeminiAssistant from './components/GeminiAssistant';
import LocationSettings from './components/LocationSettings';
import { 
  CartIcon, 
  FacebookIcon, 
  InstagramIcon,
  BurgerIcon,
  HotdogIcon,
  NachosIcon,
  DrinkIcon,
  MugIcon,
  SandwichIcon,
  BowlIcon,
  FriesIcon,
  DessertIcon,
  LocationPinIcon
} from './components/Icons';

const categoryIcons: { [key: string]: React.FC<{ className?: string }> } = {
  "Iced Coffee": DrinkIcon,
  "Fruit Soda": DrinkIcon,
  "Frappes": DrinkIcon,
  "Milktea": DrinkIcon,
  "Hot Coffee": MugIcon,
  "Burgers": BurgerIcon,
  "Hotdog": HotdogIcon,
  "Nachos": NachosIcon,
  "Clubhouse": SandwichIcon,
  "Snacks": SandwichIcon,
  "Lugaw & Sopas": BowlIcon,
  "Ramen": BowlIcon,
  "Pancit Canton": BowlIcon,
  "Fries": FriesIcon,
  "Filipino Desserts": DessertIcon,
};

const CustomerApp: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userPosition, setUserPosition] = useState<GeolocationCoordinates | null>(null);

  const allMenuItems = useMemo(() => Object.values(menuData).flat(), []);

  const addToCart = (itemToAdd: MenuItem, quantity: number, selectedSize?: { name: string; price: number }) => {
    const cartId = selectedSize ? `${itemToAdd.id}-${selectedSize.name}` : `${itemToAdd.id}`;
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.cartId === cartId);
      if (existingItem) {
        return prevItems.map(item =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      const newItem: CartItem = {
        ...itemToAdd,
        cartId,
        quantity,
        selectedSize,
      };
      return [...prevItems, newItem];
    });
    setIsCartOpen(true);
  };
  
  const updateCartQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) {
        removeFromCart(cartId);
        return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (cartId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };
  
  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setCartItems([]); // Clear cart after successful checkout simulation
  };
  
  const handleAddToCartFromAssistant = (item: MenuItem, quantity: number) => {
    const defaultSize = item.sizes ? item.sizes[0] : undefined;
    addToCart(item, quantity, defaultSize);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-amber-50 min-h-screen font-sans">
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-extrabold text-amber-900 tracking-tight">Happy Hearts</h1>
              <p className="text-sm text-orange-600 font-semibold">Coffee & Prints</p>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/profile.php?id=61574616669270" target="_blank" rel="noopener noreferrer" aria-label="Facebook Page" className="text-amber-800 hover:text-orange-600 transition-colors">
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/happyhearts_coffee_prints" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="text-amber-800 hover:text-orange-600 transition-colors">
                <InstagramIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <button onClick={() => setIsLocationModalOpen(true)} className="relative text-amber-800 hover:text-orange-600 p-2" aria-label="Set delivery location">
                <LocationPinIcon className="h-8 w-8" />
                {userPosition && (
                    <span className="absolute top-1 right-1 bg-green-500 rounded-full h-3 w-3 border-2 border-white" title="Location is set"></span>
                )}
            </button>
            <button onClick={() => setIsCartOpen(true)} className="relative text-amber-800 hover:text-orange-600 p-2" aria-label={`Open cart with ${cartItemCount} items`}>
              <CartIcon className="h-8 w-8" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {Object.entries(menuData).map(([category, items]) => {
            const IconComponent = categoryIcons[category];
            return (
              <section key={category} className="mb-12">
                <div className="flex items-center gap-4 mb-6 border-b-4 border-orange-400 pb-2">
                  {IconComponent && <IconComponent className="h-10 w-10 text-amber-800" />}
                  <h2 className="text-4xl font-bold text-amber-800 tracking-tight">{category}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {items.map(item => (
                    <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                  ))}
                </div>
              </section>
            );
        })}
      </main>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
      
      {isCheckoutOpen && (
        <Checkout 
            cartItems={cartItems}
            onClose={handleCloseCheckout}
            userPosition={userPosition}
        />
      )}

      <LocationSettings 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSave={setUserPosition}
        currentPosition={userPosition}
      />

      <GeminiAssistant menuItems={allMenuItems} onAddToCart={handleAddToCartFromAssistant} />
    </div>
  );
};

export default CustomerApp;