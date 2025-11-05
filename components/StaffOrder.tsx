import React, { useState, useMemo, useEffect } from 'react';
import { CartItem, MenuItem, TimeLog } from '../types';
import { menuData } from '../data/menuData';
import MenuItemCard from './MenuItemCard';
import Cart from './Cart';
import StaffCheckout from './StaffCheckout';
import { 
  CartIcon, 
  BurgerIcon,
  HotdogIcon,
  NachosIcon,
  DrinkIcon,
  MugIcon,
  SandwichIcon,
  BowlIcon,
  FriesIcon,
  DessertIcon
} from './Icons';

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

const StaffOrder: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [isTimedIn, setIsTimedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentStaffUser');
    if (user) {
        setStaffName(user);
        const timeLogsRaw = localStorage.getItem('staffTimeLogs');
        const timeLogs: TimeLog[] = timeLogsRaw ? JSON.parse(timeLogsRaw) : [];
        const lastUserLog = timeLogs.filter(log => log.staffName === user).pop();
        if (lastUserLog && lastUserLog.type === 'in') {
            setIsTimedIn(true);
        }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isStaffAuthenticated');
    localStorage.removeItem('currentStaffUser');
    window.location.hash = '#/staff/login';
  };

  const handleTimeIn = () => {
    const timeLogsRaw = localStorage.getItem('staffTimeLogs');
    const timeLogs: TimeLog[] = timeLogsRaw ? JSON.parse(timeLogsRaw) : [];
    const newLog: TimeLog = {
        staffName,
        timestamp: new Date().toISOString(),
        type: 'in',
    };
    localStorage.setItem('staffTimeLogs', JSON.stringify([...timeLogs, newLog]));
    setIsTimedIn(true);
    alert('You have successfully timed in.');
  };

  const handleTimeOut = () => {
      const timeLogsRaw = localStorage.getItem('staffTimeLogs');
      const timeLogs: TimeLog[] = timeLogsRaw ? JSON.parse(timeLogsRaw) : [];
      const newLog: TimeLog = {
          staffName,
          timestamp: new Date().toISOString(),
          type: 'out',
      };
      localStorage.setItem('staffTimeLogs', JSON.stringify([...timeLogs, newLog]));
      setIsTimedIn(false);
      alert('You have successfully timed out.');
  };

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
    setCartItems([]);
  };
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-stone-100 min-h-screen font-sans">
      <header className="bg-teal-700 text-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex-grow">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Staff Order Entry</h1>
             <div className="flex items-center gap-4">
                <p className="text-sm text-teal-100">Welcome, <span className="font-semibold">{staffName}</span>!</p>
                <a href="#/admin" className="text-sm text-white hover:underline font-semibold">&larr; Back to Admin Dashboard</a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsCartOpen(true)} className="relative text-white hover:text-teal-200 p-2" aria-label={`Open cart with ${cartItemCount} items`}>
              <CartIcon className="h-8 w-8" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            {!isTimedIn ? (
              <button onClick={handleTimeIn} className="bg-green-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-green-600 transition-colors text-sm whitespace-nowrap">
                  Time In
              </button>
            ) : (
                <button onClick={handleTimeOut} className="bg-yellow-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-yellow-600 transition-colors text-sm whitespace-nowrap">
                    Time Out
                </button>
            )}
            <button onClick={handleLogout} className="bg-rose-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-rose-600 transition-colors text-sm">
                Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {Object.entries(menuData).map(([category, items]) => {
            const IconComponent = categoryIcons[category];
            return (
              <section key={category} className="mb-12">
                <div className="flex items-center gap-4 mb-6 border-b-4 border-teal-500 pb-2">
                  {IconComponent && <IconComponent className="h-10 w-10 text-teal-700" />}
                  <h2 className="text-4xl font-bold text-teal-800 tracking-tight">{category}</h2>
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
        <StaffCheckout 
            cartItems={cartItems}
            onClose={handleCloseCheckout}
            staffName={staffName}
        />
      )}
    </div>
  );
};

export default StaffOrder;